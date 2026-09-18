
import { Socket } from "socket.io"
import { joinRoomSchema } from "../schemas.js"
import { addPlayer, resetPlayerByReconnection } from "../../temporarly-database/rooms-management.js"
import { socketIoEvents, socketIoRooms } from "../socket.io-keys-generators.js"
import { createPlayerToken } from "../../utils/tokens/generation.js"
import { uuidv7 } from "uuidv7"
import { isPlayerTokenValidationError, verifyPlayerToken } from "../../utils/tokens/validation.js"

const joinRoomController = async (socket: Socket, data: unknown) => {
    const validation = joinRoomSchema.safeParse(data)

    if (!validation.success) {
        return
    }

    const { room, username, recoveryToken } = validation.data

    if (!recoveryToken) {
        if (!username) {
            return
        }

        const playerId = uuidv7()

        const added = await addPlayer(room, { username, socket: socket.id, playerId })

        if ((added === "ROOM_NOT_FOUND") || (added === "MAX_CANDIDATES") || (added === "ALREADY_JOINED") || (added === "GAME_ALREADY_STARTED")) {
            /*
            null = Stanza non trovata
            */
            return
        }

        socket.data.room = room
        socket.data.username = added

        const gameExpiration = Math.floor(Date.now() / 1000) + 60 * 5
        const token = createPlayerToken(room, added, playerId, gameExpiration)

        socket.join(socketIoRooms.quizRoom(room))
        socket.emit(socketIoEvents.RECOVERY_TOKEN, { token })
    }
    else {
        const tokenCheck = verifyPlayerToken(recoveryToken)

        if (isPlayerTokenValidationError(tokenCheck)) {
            return
        }

        if (room !== tokenCheck.room) {
            return
        }

        const resetted = await resetPlayerByReconnection(tokenCheck.room, tokenCheck.playerId, socket.id)

        if ((resetted == null) || (resetted === "PLAYER_ALREADY_CONNECTED") || (resetted === "PLAYERID_NOT_FOUND")) {
            return
        }

        socket.data.room = room
        socket.data.username = resetted

        socket.join(socketIoRooms.quizRoom(room))
    }

}

export {
    joinRoomController
}
