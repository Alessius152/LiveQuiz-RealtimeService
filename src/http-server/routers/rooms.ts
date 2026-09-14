
import { FastifyPluginAsync } from "fastify"
import { createRoomSchema, startGameSchema } from "../schemas/fastify/rooms.js"
import { createRoomController } from "../controllers/rooms/create-room-controller.js"
import { startGameController } from "../controllers/rooms/start-game-controller.js"

const roomsRouter: FastifyPluginAsync = async (fastify) => {

    fastify.post('/',
        {
            schema: createRoomSchema
        },
        createRoomController
    )

    fastify.post('/start-game',
        {
            schema: startGameSchema
        },
        startGameController
    )

}

export {
    roomsRouter
}

