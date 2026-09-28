
import Fastify from 'fastify'
import cors from '@fastify/cors'
import { roomsRouter } from './routers/rooms.js'
import { startSocketServer } from '../socket-server/server.js'
import { redisCluster, testCluster } from '../config/redis.js'
import { connectKafka } from '../config/kafka.js'
import { getIO, setIO } from '../global/ioInstance.js'

import '../game/game-flow-worker.js'
import { testBullmqRedis } from '../config/redis-bullmq.js'

const server = Fastify({ logger: true })

const start = async () => {
    try {
        setIO(await startSocketServer(server))
        console.log("bootstrap 5.6")
        server.decorate('io', getIO())
        server.register(roomsRouter, { prefix: '/room' })
        console.log("bootstrap 5.7")

        await server.register(cors, {
            origin: true
        })

        await server.listen({ port: Number(process.env.SERVER_PORT), host: process.env.SERVER_HOST })
        console.log("bootstrap 5.8")
    }
    catch (err) {
        server.log.error({ err }, "error starting server")
        process.exit(1)
    }
}

(async () => {
    console.log("bootstrap 1")
    await Promise.race([
        redisCluster.connect(),
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error('Redis Cluster connect timeout')),
                10000
            )
        )
    ])
    console.log("bootstrap 2")
    await testCluster()
    console.log("bootstrap 3")
    await testBullmqRedis()
    console.log("bootstrap 4")
    await connectKafka()
    console.log("bootstrap 5")
    await start()
    console.log("bootstrap 6")
})()
