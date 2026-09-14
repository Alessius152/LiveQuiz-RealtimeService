
import { Socket } from "socket.io"
import { joinRoomSchema } from "../schemas.js"
import { addPlayer } from "../../temporarly-database/rooms-management.js"
import { socketIoRooms } from "../socket.io-keys-generators.js"

const joinRoomController = async (socket: Socket, data: unknown) => {

    const validation = joinRoomSchema.safeParse(data)

    if (!validation.success) {
        return
    }

    const { room, username } = validation.data
    const added = await addPlayer(room, { username, socket: socket.id })

    if ((added === null) || (added === "MAX_CANDIDATES") || (added === "ALREADY_JOINED")) {
        /*
        null = Stanza non trovata
        MAX_CANDIDATES vuol dire che ci sono troppi utenti con lo stesso nome e suffisso calcolato
        */
        return
    }

    socket.data.room = room
    socket.data.username = added

    socket.join(socketIoRooms.quizRoom(room))

}

export {
    joinRoomController
}
