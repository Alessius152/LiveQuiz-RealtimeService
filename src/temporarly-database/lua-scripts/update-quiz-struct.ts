const UPDATE_QUIZ_STRUCT_SCRIPT = `
local quizKey = KEYS[1]
local newVersion = tonumber(ARGV[1])
local toAdd = cjson.decode(ARGV[2])

if redis.call("exists", quizKey) == 0 then
    return "QUIZ_NOT_FOUND"
end

local questionsJson = redis.call("json.get", quizKey, "$.questions")
local questionsParsed = cjson.decode(questionsJson)[1]

if (toAdd ~= nil) and (type(toAdd) == "table") then

    local seenIndexes = {}

    for _, question in ipairs(toAdd) do
        local qId = tostring(question.qI)

        if questionsParsed[qId] ~= nil then
            return "QUESTION_INDEX_ALREADY_EXISTS"
        end

        if seenIndexes[qId] ~= nil then
            return "DUPLICATE_QUESTION_INDEX"
        end

        seenIndexes[qId] = true
    end

    for _, question in ipairs(toAdd) do 
        local qIndex = tostring(question.qI)
        local qType = question.t
        local options = question.o
        local answers = question.a
        local hasOptions = options ~= nil and options ~= cjson.null
        local hasAnswers = answers ~= nil and answers ~= cjson.null
        
        if (qType ~= 0) and (qType ~= 1) and (qType ~= 2) then
            return "INVALID_QUESTION_TYPE"
        end

        if qType == 0 then
            if hasOptions
                or not hasAnswers
                or #answers ~= 1
                or (answers[1] ~= 0 and answers[1] ~= 1)
            then
                return "INVALID_TRUE_FALSE_QUESTION"
            end
        end

        if qType == 1 then
            if hasOptions or hasAnswers then
                return "INVALID_OPEN_QUESTION"
            end
        end

        if qType == 2 then
            if not hasOptions
                or not hasAnswers
                or #options < 2
                or #answers < 1
            then
                return "INVALID_CLOSED_QUESTION"
            end
        end

        redis.call("json.set", quizKey, '$.questions["' .. qIndex .. '"]', cjson.encode({
            type = qType,
            options = options,
            answers = answers
        }))
    end
end

redis.call("json.set", quizKey, "$.metadata[2]", newVersion)
return "OK"
`

export default UPDATE_QUIZ_STRUCT_SCRIPT