
import { RouteHandlerMethod } from "fastify"
import { HttpStatusCode } from "../../utils/enums/http-status-code.js"
import { loadNewRoom } from "../../temporarly-database/rooms-management.js"
import { checkQuizExists } from "../../temporarly-database/quizzes-cache.js"

const createRoomController: RouteHandlerMethod = async (request, reply) => {

    const { quizId } = request.body as { quizId: string }

    try {

        const existance = await checkQuizExists(quizId)
        if (!existance) {
            return reply.status(HttpStatusCode.NOT_FOUND).send({})
        }

        const { code } = await loadNewRoom(quizId)
        return reply.status(HttpStatusCode.CREATED).send({ code })

    }
    catch (err) {
        request.log.error({ err }, 'createRoomController')
        return reply.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({})
    }

}

export {
    createRoomController
}
