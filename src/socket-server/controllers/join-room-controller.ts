
import { Socket } from "socket.io"
import { joinRoomSchema } from "../schemas.js"
import { addPlayer, resetPlayerByReconnection } from "../../temporarly-database/rooms-management.js"
import { socketIoEvents, socketIoRooms } from "../socket.io-keys-generators.js"
import { createPlayerAnsweringToken, createPlayerReconnectionToken } from "../../utils/tokens/generation.js"
import { uuidv7 } from "uuidv7"
import { isPlayerReconnectionTokenValidationError, verifyPlayerReconnectionToken } from "../../utils/tokens/validation.js"

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

        const gameExpiration = Math.floor(Date.now() / 1000) + 60 * 3 * 170 /*questa viene calcolata nel massimo
        ogni domanda ha un timeout che, di default, è 30 secondi, ma può essere allungato a 3 minuti massimo, per quelle
        domande che, a livello umano, vengono valutate più complicate.
        Anche se la stanza termina, e il token rimane valido, perché le domande erano tutte di 30 secondi,
        comunque non potrà essere usato, perché la stanza verrà distrutta, ma indipendentemente da questo,
        il server verificherà che la stanza sulla quale vogliamo operare sia uguale a quella riportata nel token.

        Conclusione: serve un token nuovo per ogni stanza.

        Da notare, io calcolo il massimo pensando che ogni domanda sia di 3 minuti e moltiplico per 170.
        Ma un quiz può avere al massimo 150 domande, non 170, 170 è troppo, anche aldilà del calcolo massimo.

        Questo ci da la certezza matematica che l'utente, anche rispondendo all'ultimo millisecondo, non riscontri problemi 
        del tipo: "401: token scaduto" o altro quando sta semplicemente giocando legittimamente
        */
        const reconnectionToken = createPlayerReconnectionToken(room, added, playerId, gameExpiration)
        const answeringToken = createPlayerAnsweringToken(room, playerId, gameExpiration)

        socket.join(socketIoRooms.quizRoom(room))
        socket.emit(socketIoEvents.RECOVERY_TOKEN, {
            sessionTokens: {
                reconnection: reconnectionToken,
                answering: answeringToken
            }
        })
    }
    else {
        const tokenCheck = verifyPlayerReconnectionToken(recoveryToken)

        if (isPlayerReconnectionTokenValidationError(tokenCheck)) {
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
