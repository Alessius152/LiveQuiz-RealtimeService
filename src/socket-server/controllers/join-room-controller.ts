
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

        if ((added === null) || (added === "MAX_CANDIDATES") || (added === "ALREADY_JOINED")) {
            /*
            null = Stanza non trovata
            MAX_CANDIDATES vuol dire che ci sono troppi utenti con lo stesso nome e suffisso calcolato
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
