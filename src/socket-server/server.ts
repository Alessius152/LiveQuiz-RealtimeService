
import { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { redisCluster } from '../config/redis.js'
import { createShardedAdapter } from '@socket.io/redis-adapter'

const startSocketServer = (fastify: FastifyInstance) => {

    const io = new Server(fastify.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    const pubClient = redisCluster.duplicate()
    const subClient = redisCluster.duplicate()

    io.adapter(createShardedAdapter(pubClient, subClient))

    io.on('connection', (socket) => {
        fastify.log.info(`Client connesso: ${socket.id}`)

        

        socket.on('disconnect', () => {
            fastify.log.info(`Client disconnesso: ${socket.id}`)
        })
    })

    return io

}

export {
    startSocketServer,
}
