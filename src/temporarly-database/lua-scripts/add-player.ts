
const ADD_PLAYER_SCRIPT = `
local room = KEYS[1]
local username = ARGV[1]
local socketId = ARGV[2]
local playerId = ARGV[3]

if redis.call("exists", room) == 0 then
    return nil
end

local playersJson = redis.call("json.get", room, "$.players[*]")
local players = {}

if playersJson then
    players = cjson.decode(playersJson)
end

local candidate = username

for suffix = 0, 3 do
    if suffix > 0 then
        candidate = username .. " (" .. suffix .. ")"
    end
    
    local found = false

    for _, existingPlayer  in ipairs(players) do
        if existingPlayer.socketId == socketId then
            return "ALREADY_JOINED"
        end

        if existingPlayer.username == candidate then
            found = true
            break
        end
    end

    if not found then
        redis.call("json.arrappend", room, ".players", cjson.encode({username = candidate, socketId = socketId, playerId = playerId}))
        return candidate
    end
end

return "MAX_CANDIDATES"
`

export default ADD_PLAYER_SCRIPT
