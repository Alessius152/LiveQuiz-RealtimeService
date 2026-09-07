import { redisCluster } from "../config/redis.js"
import { RealtimeRoomStatus } from "../types/realtime-room.js"

const loadNewRoom: (quizId: string) => Promise<RealtimeRoomStatus> = async (quizId) => {

    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {

        const code = Math.floor(Math.random() * 900000) + 100000
        const key = `room:${code}`
        const roomStatus: RealtimeRoomStatus = { code, status: 'waiting', players: [] }
        const result = await redisCluster.call(
            'JSON.SET', 
            key, 
            '$', 
            JSON.stringify(roomStatus), 
            'NX'
        )

        if (result === 'OK') {
            return roomStatus
        }

        attempts++

    }

    throw new Error('', { cause: 'max_attempts_reached' })

}

const deleteRoom = async (roomCode: number) => {

    const key = `room:${roomCode}`
    const result = await redisCluster.del(key)
    
    return result === 1

}

export {
    loadNewRoom,
    deleteRoom,
}
