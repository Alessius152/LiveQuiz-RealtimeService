
const FINALIZE_GAME_SCRIPT = `
local roomKey = KEYS[1]

local playerPath = "$.players[*].playerId"
local roomDataJson = redis.call(
    "json.get", 
    roomKey, 
    playerPath, 
    "$.status", 
    "$.currentQuestion", 
    "$.questionsOrder", 
    "$.answersHistory"
)

if not roomDataJson then
    return "ROOM_NOT_FOUND"
end

local roomData = cjson.decode(roomDataJson)

local status = roomData["$.status"][1]
local players = roomData[playerPath]
local answersHistory = roomData["$.answersHistory"][1]
local currentQuestion = roomData["$.currentQuestion"][1]
local questionsOrder = roomData["$.questionsOrder"][1]

if status == "finalized" then
    return "GAME_ALREADY_FINALIZED"
end

if currentQuestion ~= "finished" then
    return "GAME_NOT_FINISHED"
end

for _, questionId in ipairs(questionsOrder) do
    local questionAnswersHistory = answersHistory[tostring(questionId)]

    if not questionAnswersHistory then 
        redis.call("json.numincrby", roomKey, "$.players[*].score", -15) -- decremento a tutti i 15 punti perché nessuno ha risposto
    else
        for _, pId in ipairs(players) do
            local playerAnswer = questionAnswersHistory[pId]

            if not playerAnswer then
                redis.call("json.numincrby", roomKey, '$.players[?(@.playerId == "' .. pId .. '")].score', -15)
            end
        end
    end
end

redis.call("json.set", roomKey, "$.status", '"finalized"')
return "OK"
`

export default FINALIZE_GAME_SCRIPT
