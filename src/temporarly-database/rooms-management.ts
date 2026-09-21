import { redisCluster } from "../config/redis.js"
import { ParsedCreatedQuizEventPayload } from "../types/quizzes-storage.js"
import { PlayerJoinInput, RealtimeRoomStatus } from "../types/realtime-room.js"
import ADD_PLAYER_SCRIPT from "./lua-scripts/add-player.js"
import ADVANCE_CURRENT_QUESTION_SCRIPT from "./lua-scripts/advance-current-question.js"
import DISCONNECT_PLAYER_SCRIPT from "./lua-scripts/disconnect-player.js"
import HANDLE_PLAYER_RECONNECTION_SCRIPT from "./lua-scripts/handle-player-reconnection.js"
import REGISTER_PLAYER_ANSWER_SCRIPT from "./lua-scripts/register-player-answer.js"
import SET_ROOM_STATUS_AS_RUNNING_SCRIPT from "./lua-scripts/set-room-status-as-running.js"
import { quizKey, roomKey } from "./redis-keys-generators.js"

const loadNewRoom: (quizId: string) => Promise<"QUIZ_SNAPSHOT_NOT_FOUND" | RealtimeRoomStatus> = async (quizId) => {

    const qKey = quizKey(quizId)
    const qSnapshot = (await redisCluster.call("json.get", qKey, "$")) as string | null

    if (!qSnapshot) {
        return "QUIZ_SNAPSHOT_NOT_FOUND"
    }

    const parsedSnapshot = JSON.parse(qSnapshot)[0] as ParsedCreatedQuizEventPayload

    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {

        const code = `${Math.floor(Math.random() * 900000) + 100000}`
        const key = roomKey(code)
        const questionsOrder = Object.keys(parsedSnapshot.questions).sort((a, b) => Number(a) - Number(b)).map(index => Number(index))
        const roomStatus: RealtimeRoomStatus = {
            immutableQuizSnapshot: parsedSnapshot.questions,
            code,
            status: 'waiting',
            players: [],
            questionsOrder,
            currentQuestion: null,
            answersHistory: {},
        }
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

const addPlayer = async (room: string, player: PlayerJoinInput): Promise<
    "ROOM_NOT_FOUND" | "ALREADY_JOINED" | "MAX_CANDIDATES" | "GAME_ALREADY_STARTED"
> => {
    return await redisCluster.eval(ADD_PLAYER_SCRIPT, 1, roomKey(room), player.username, player.socket, player.playerId) as any
}

const disconnectPlayer = async (room: string, username: string, socket: string): Promise<0 | 1> => {
    return await redisCluster.eval(DISCONNECT_PLAYER_SCRIPT, 1, roomKey(room), username, socket) as any
}

const setRoomStatusAsRunning = async (room: string): Promise<
    "ROOM_NOT_FOUND" | "ALREADY_RUNNING" | "OK"
> => {
    return await redisCluster.eval(SET_ROOM_STATUS_AS_RUNNING_SCRIPT, 1, roomKey(room)) as any
}

const resetPlayerByReconnection = async (room: string, playerId: string, socketId: string): Promise<
    null | "PLAYER_ALREADY_CONNECTED" | "PLAYERID_NOT_FOUND"
> => {
    return await redisCluster.eval(HANDLE_PLAYER_RECONNECTION_SCRIPT, 1, roomKey(room), playerId, socketId) as any
}

const advanceCurrentQuestion = async (room: string, expectedCurrentQuestion: null | number): Promise<
    "ROOM_NOT_FOUND" | [number, number] | "CURRENT_QUESTION_NOT_FOUND" | "QUIZ_FINISHED" | "STALE_JOB"
> => {
    return await redisCluster.eval(ADVANCE_CURRENT_QUESTION_SCRIPT, 1, roomKey(room), JSON.stringify(expectedCurrentQuestion)) as any
}

const registerPlayerAnswer = async (room: string, socketId: string, playerId: string, questionId: number, answer: number | Array<number> | string): Promise<
    "ROOM_NOT_FOUND" | "UNPROCESSABLE_QUESTION" | "PLAYER_IS_NOT_PLAYING" | 
    "UNABLE_TO_WRITE_STATUS_OF_ANOTHER_USER" | "OK" | "INVALID_ANSWER" | "ALREADY_ANSWERED"
> => {
    return await redisCluster.eval(REGISTER_PLAYER_ANSWER_SCRIPT, 1, roomKey(room), socketId, playerId, questionId, JSON.stringify(answer)) as any
}

export {
    loadNewRoom,
    deleteRoom,
    getRoom,
    addPlayer,
    disconnectPlayer,
    setRoomStatusAsRunning,
    resetPlayerByReconnection,
    advanceCurrentQuestion,
    registerPlayerAnswer,
}
