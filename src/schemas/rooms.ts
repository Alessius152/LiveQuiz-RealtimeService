
import { FastifySchema } from "fastify"

const createRoomSchema: FastifySchema = {
    body: {
        type: 'object',
        required: ['quizId'],
        properties: {
            quizId: {
                type: 'string',
                format: 'uuid'
            }
        }
    }
}

export {
    createRoomSchema
}
