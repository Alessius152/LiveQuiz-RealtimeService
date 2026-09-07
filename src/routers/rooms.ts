

import { FastifyPluginAsync } from "fastify"
import { createRoomSchema } from "../schemas/rooms.js"
import { createRoomController } from "../controllers/rooms/createRoomController.js"

const roomsRouter: FastifyPluginAsync = async (fastify) => {

    fastify.post('/',
        {
            schema: createRoomSchema
        },
        createRoomController
    )

}

export {
    roomsRouter
}

