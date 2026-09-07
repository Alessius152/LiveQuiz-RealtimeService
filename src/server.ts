
import Fastify from 'fastify'
import { testCluster } from './config/redis.js'
import { connectKafka } from './config/kafka.js'
import { roomsRouter } from './routers/rooms.js'
import { startSocketServer } from './socket-server/server.js'

const server = Fastify({ logger: true })

const start = async () => {
    try {
        startSocketServer(server)
        await server.listen({ port: Number(process.env.SERVER_PORT), host: process.env.SERVER_HOST })
    }
    catch (err) {
        server.log.error({ err }, "error starting server")
        process.exit(1)
    }
}

(async () => {
    server.register(roomsRouter, { prefix: '/room' })

    await testCluster()
    await connectKafka()
    await start()
})()
