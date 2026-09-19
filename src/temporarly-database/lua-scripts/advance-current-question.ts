
const ADVANCE_CURRENT_QUESTION_SCRIPT = `
local room = KEYS[1]
local expectedCurrQuestJson = ARGV[1]
local roomDataJson = redis.call("json.get", room, "$.questionsOrder", "$.currentQuestion")

if not roomDataJson then
    return "ROOM_NOT_FOUND"
end

local roomData = cjson.decode(roomDataJson)
local questionsOrder = roomData["$.questionsOrder"][1]
local currentQuestion = roomData["$.currentQuestion"][1]

if currentQuestion == nil or currentQuestion == cjson.null then
    local firstQuestion = questionsOrder[1]
    local questionTimeoutJSON = redis.call("json.get", room, "$.immutableQuizSnapshot."..firstQuestion..".timeout")
    local questionTimeout = cjson.decode(questionTimeoutJSON)[1]

    if questionTimeout == nil then
        questionTimeout = 30
    end

    redis.call("json.set", room, "$.currentQuestion", tostring(firstQuestion))
    return {firstQuestion, questionTimeout}
end

if currentQuestion == "finished" then
    return "QUIZ_FINISHED"
end

if tonumber(cjson.decode(expectedCurrQuestJson)) ~= currentQuestion then
    return "STALE_JOB"
end

local currentQuestionIndex;

for qIndex, programmedQuestion in ipairs(questionsOrder) do
    if programmedQuestion == currentQuestion then
        currentQuestionIndex = qIndex
        break
    end
end

if not currentQuestionIndex then
    return "CURRENT_QUESTION_NOT_FOUND"
end

if currentQuestionIndex >= #questionsOrder then
    redis.call("json.set", room, "$.currentQuestion", '"finished"')
    return "QUIZ_FINISHED"
end

local nextQuestion = questionsOrder[currentQuestionIndex + 1]
local questionTimeoutJSON = redis.call("json.get", room, "$.immutableQuizSnapshot."..nextQuestion..".timeout")
local questionTimeout = cjson.decode(questionTimeoutJSON)[1]

if questionTimeout == nil then
    questionTimeout = 30
end

redis.call("json.set", room, "$.currentQuestion", tostring(nextQuestion))
return {nextQuestion, questionTimeout}
`

export default ADVANCE_CURRENT_QUESTION_SCRIPT
