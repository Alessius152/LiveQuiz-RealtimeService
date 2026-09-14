const SET_ROOM_STATUS_AS_RUNNING_SCRIPT = `
local room = KEYS[1]

if redis.call("exists", room) == 0 then
    return "ROOM_NOT_FOUND"
end

local status = redis.call("json.get", room, "$.status")

if status ~= '["waiting"]' then
    return "ALREADY_RUNNING"
end

redis.call("json.set", room, "$.status", '"running"')

return "OK"
`

export default SET_ROOM_STATUS_AS_RUNNING_SCRIPT
