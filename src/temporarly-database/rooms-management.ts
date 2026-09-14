import { redisCluster } from "../config/redis.js"
import { PlayerJoinInput, RealtimeRoomStatus } from "../types/realtime-room.js"
import ADD_PLAYER_SCRIPT from "./lua-scripts/add-player.js"
import DISCONNECT_PLAYER_SCRIPT from "./lua-scripts/disconnect-player.js"
import SET_ROOM_STATUS_AS_RUNNING_SCRIPT from "./lua-scripts/set-room-status-as-running.js"
import { roomKey } from "./redis-keys-generators.js"

const loadNewRoom: (quizId: string) => Promise<RealtimeRoomStatus> = async (quizId) => {

    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {

        const code = `${Math.floor(Math.random() * 900000) + 100000}`
        const key = roomKey(code)
        const roomStatus: RealtimeRoomStatus = { quizId, code, status: 'waiting', players: [] }
        const result = await redisCluster.call("json.set", key, "$", JSON.stringify(roomStatus), "NX")

        if (result === 'OK') {
            return roomStatus
        }

        attempts++

    }

    throw new Error('', { cause: 'max_attempts_reached' })

}

const deleteRoom = async (code: string) => {

    const key = roomKey(code)
    const result = await redisCluster.del(key)

    return result === 1

}

const getRoom = async (code: string): Promise<RealtimeRoomStatus | null> => {

    const key = roomKey(code)
    const result = await redisCluster.call(
        "json.get",
        key,
        "$"
    ) as string | null

    if (!result) {
        return null
    }

    const parsed = JSON.parse(result)
    return parsed[0] as RealtimeRoomStatus

}

const addPlayer = async (room: string, player: PlayerJoinInput) => {
    return await redisCluster.eval(ADD_PLAYER_SCRIPT, 1, roomKey(room), player.username, player.socket)
}

const disconnectPlayer = async (room: string, username: string, socket: string) => {
    return await redisCluster.eval(DISCONNECT_PLAYER_SCRIPT, 1, roomKey(room), username, socket)
}

const setRoomStatusAsRunning = async (room: string) => {
    return await redisCluster.eval(SET_ROOM_STATUS_AS_RUNNING_SCRIPT, 1, roomKey(room))
}

export {
    loadNewRoom,
    deleteRoom,
    getRoom,
    addPlayer,
    disconnectPlayer,
    setRoomStatusAsRunning
}
