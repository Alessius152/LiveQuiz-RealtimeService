
const REGISTER_PLAYER_ANSWER_SCRIPT = `
local room = KEYS[1]
local socketId = ARGV[1]
local playerId = ARGV[2]
local questionId = tonumber(ARGV[3])
local answer = cjson.decode(ARGV[4])

local questionRedisPath = "$.immutableQuizSnapshot." .. questionId
local playerIdRedisPath = '$.players[?(@.socketId == "'..socketId..'")].playerId'
local playerScoreRedisPath = '$.players[?(@.socketId == "'..socketId..'")].score'
local roomDataJson = redis.call("json.get", room, "$.currentQuestion", questionRedisPath, playerIdRedisPath, playerScoreRedisPath)

if not roomDataJson then
    return "ROOM_NOT_FOUND"
end

local roomDataParsed = cjson.decode(roomDataJson)
local currentQuestion = roomDataParsed["$.currentQuestion"][1]
local questionFromSnapshot = roomDataParsed[questionRedisPath][1]
local playerData = roomDataParsed[playerIdRedisPath][1]

if currentQuestion == nil or currentQuestion == cjson.null or currentQuestion == "finished" then return "UNPROCESSABLE_QUESTION" end
if currentQuestion.id ~= questionId then return "UNPROCESSABLE_QUESTION" end
if not playerData then return "PLAYER_IS_NOT_PLAYING" end
if playerData ~= playerId then return "UNABLE_TO_WRITE_STATUS_OF_ANOTHER_USER" end

local answerType = type(answer)

if questionFromSnapshot.type == 0 then
    if answerType ~= "number" or (answer ~= 0 and answer ~= 1) then
        return "INVALID_ANSWER"
    end

elseif questionFromSnapshot.type == 1 then
    if answerType ~= "string" then
        return "INVALID_ANSWER"
    end

elseif questionFromSnapshot.type == 2 then
    if answerType ~= "table" then
        return "INVALID_ANSWER"
    end

    if #answer == 0 then
        return "INVALID_ANSWER"
    end

    for _, v in ipairs(answer) do 
        if type(v) ~= "number" then
            return "INVALID_ANSWER"
        end
        
        local isExistantOption = false

        for _, v2 in ipairs(questionFromSnapshot.options) do 
            if v2 == v then
                isExistantOption = true
                break
            end
        end

        if not isExistantOption then
            return "INVALID_ANSWER"
        end
    end
end

local answerRedisPath = "$.answersHistory."..questionId
local playerAnswerRedisPath = answerRedisPath.."."..playerId

redis.call("json.set", room, answerRedisPath, "{}", "nx")

local redisTime = redis.call("time")
local sentAt = redisTime[1] * 1000 + math.floor(redisTime[2] / 1000)
local result = redis.call("json.set", room, playerAnswerRedisPath, cjson.encode({
    answer = answer,
    sentAt = sentAt
}), "nx")

if not result then
    return "ALREADY_ANSWERED"
end

local function calculateScoreDelta(question, inputAnswer, sentAt)
    local delta = 0
    local type = question.type

    if type == 1 then
        return delta
    end

    local correctAnswer = question.answers
    
    if type == 0 then
        if inputAnswer == correctAnswer[1] then
            delta = delta + 100
        else 
            delta = delta - 45
        end
    elseif type == 2 then
        for _, optionSelected in ipairs(inputAnswer) do
            local isCorrect = false

            for _, singleCorrectAnswer in ipairs(correctAnswer) do
                if optionSelected == singleCorrectAnswer then
                    isCorrect = true
                    break
                end
            end

            if not isCorrect then
                delta = 0
                break
            end

            delta = delta + 100
        end
    end

    return delta
end

local scoreDelta = calculateScoreDelta(questionFromSnapshot, answer, sentAt)

if scoreDelta ~= 0 then
    redis.call("json.numincrby", room, playerScoreRedisPath, scoreDelta)
end

return "OK"
`

export default REGISTER_PLAYER_ANSWER_SCRIPT
