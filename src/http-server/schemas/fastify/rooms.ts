
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

const startGameSchema: FastifySchema = {
    body: {
        type: 'object',
        required: ['hostToken'],
        properties: {
            hostToken: {
                type: 'string',
                pattern: '^[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+$'
            }
        }
    }
}

export {
    createRoomSchema,
    startGameSchema,
}
