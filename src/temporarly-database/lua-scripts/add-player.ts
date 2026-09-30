
const ADD_PLAYER_SCRIPT = `
local room = KEYS[1]
local username = ARGV[1]
local socketId = ARGV[2]
local playerId = ARGV[3]

local playersFormatKey = "$.players"

local roomDataJson = redis.call(
    "JSON.GET",
    room,
    "$.status",
    playersFormatKey
)

if not roomDataJson then
    return "ROOM_NOT_FOUND"
end

local roomData = cjson.decode(roomDataJson)

local status = roomData["$.status"][1]

if status == "running" then
    return "GAME_ALREADY_STARTED"
end

local players = roomData[playersFormatKey][1]

local candidate = username

for suffix = 0, 3 do

    if suffix > 0 then
        candidate = username .. " (" .. suffix .. ")"
    end

    local found = false

    for _, existingPlayer in ipairs(players) do

        if existingPlayer.socketId == socketId then
            return "ALREADY_JOINED"
        end

        if existingPlayer.username == candidate then
            found = true
            break
        end

    end

    if not found then

        redis.call(
            "JSON.ARRAPPEND",
            room,
            "$.players",
            cjson.encode({
                username = candidate,
                socketId = socketId,
                playerId = playerId,
                score = 0
            })
        )

        local usernames = {}

        for _, player in ipairs(players) do
            table.insert(usernames, player.username)
        end

        if #usernames == 0 then
            return {candidate, "[]"}
        else 
            return {candidate, cjson.encode(usernames)}
        end
    end
end

return "MAX_CANDIDATES"
`

export default ADD_PLAYER_SCRIPT
