const DISCONNECT_PLAYER_SCRIPT = `
local room = KEYS[1]
local username = ARGV[1]
local socketId = ARGV[2]

if redis.call("exists", room) == 0 then
    return 0
end

local playersJson = redis.call("json.get", room, "$.players[*]")

if not playersJson then
    return 0
end

local players = cjson.decode(playersJson)

for i, player in ipairs(players) do
    if player.username == username then
        if player.socketId ~= socketId then
            return 0
        end

        redis.call("json.set", room, "$.players[" .. (i - 1) .. "].socketId", cjson.encode(cjson.null))
        return 1
    end
end

return 0
`

export default DISCONNECT_PLAYER_SCRIPT