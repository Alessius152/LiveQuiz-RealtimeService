
import { RouteHandlerMethod } from "fastify"
import { checkQuizExists } from "../../../temporarly-database/quizzes-cache.js"
import { HttpStatusCode } from "../../../utils/enums/http-status-code.js"
import { loadNewRoom } from "../../../temporarly-database/rooms-management.js"
import { createHostToken } from "../../../utils/tokens/generation.js"

const createRoomController: RouteHandlerMethod = async (request, reply) => {

    const { quizId } = request.body as { quizId: string }

    try {

        const existance = await checkQuizExists(quizId)
        if (!existance) {
            return reply.status(HttpStatusCode.NOT_FOUND).send({})
        }

        const { code } = await loadNewRoom(quizId)
        const hostToken = createHostToken(code)

        return reply.status(HttpStatusCode.CREATED).send({ code, hostToken })

    }
    catch (err) {
        request.log.error({ err }, 'createRoomController')
        return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({})
    }

}

export {
    createRoomController
}
