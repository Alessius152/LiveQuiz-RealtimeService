
import { RouteHandlerMethod } from "fastify"
import { HttpStatusCode } from "../../../utils/enums/http-status-code.js"
import { isHostTokenValidationError, verifyHostToken } from "../../../utils/tokens/validation.js"
import { setRoomStatusAsRunning } from "../../../temporarly-database/rooms-management.js"
import { socketIoRooms } from "../../../socket-server/socket.io-keys-generators.js"

const startGameController: RouteHandlerMethod = async (request, reply) => {

    const { hostToken } = request.body as { hostToken: string }

    try {
        const tokenCheck = verifyHostToken(hostToken)
        const io = request.server.io

        if (isHostTokenValidationError(tokenCheck)) {
            return reply.status(HttpStatusCode.UNAUTHORIZED).send({})
        }

        const result = await setRoomStatusAsRunning(tokenCheck.room)

        if (result != "OK") {
            return reply.status(HttpStatusCode.CONFLICT).send({ error: result })
        }

        io.to(socketIoRooms.quizRoom(tokenCheck.room)).emit('game-started', {})
        reply.status(HttpStatusCode.OK).send({})
    }
    catch (err) {
        request.log.error({ err }, 'startGameController')
        return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({})
    }

}

export {
    startGameController
}
