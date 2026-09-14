
const HANDLE_PLAYER_RECONNECTION_SCRIPT = `
local room = KEYS[1]
local playerId = ARGV[1]
local connSocketId = ARGV[2]

if redis.call("exists", room) == 0 then
    return nil
end

local playersJson = redis.call("json.get", room, "$.players[*]")
local players = {}

if playersJson then
    players = cjson.decode(playersJson)
end

for index, joinedPlayer in ipairs(players) do
    if joinedPlayer.playerId == playerId then
        if joinedPlayer.socketId ~= cjson.null then
            return "PLAYER_ALREADY_CONNECTED"
        end

        redis.call("json.set", room, ".players["..(index-1).."].socketId", cjson.encode(connSocketId))
        return joinedPlayer.username
    end
end

return "PLAYERID_NOT_FOUND"
`

export default HANDLE_PLAYER_RECONNECTION_SCRIPT
