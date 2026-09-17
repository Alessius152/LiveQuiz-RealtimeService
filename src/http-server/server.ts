
import Fastify from 'fastify'
import { roomsRouter } from './routers/rooms.js'
import { startSocketServer } from '../socket-server/server.js'
import { testCluster } from '../config/redis.js'
import { connectKafka } from '../config/kafka.js'
import { getIO, setIO } from '../global/ioInstance.js'

import '../game/game-flow-worker.js'

const server = Fastify({ logger: true })

const start = async () => {
    try {
        setIO(startSocketServer(server))

        server.decorate('io', getIO())
        server.register(roomsRouter, { prefix: '/room' })
        
        await server.listen({ port: Number(process.env.SERVER_PORT), host: process.env.SERVER_HOST })
    }
    catch (err) {
        server.log.error({ err }, "error starting server")
        process.exit(1)
    }
}

(async () => {
    await testCluster()
    await connectKafka()
    await start()
})()
