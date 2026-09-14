
import { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { redisCluster } from '../config/redis.js'
import { createShardedAdapter } from '@socket.io/redis-adapter'
import { joinRoomController } from './controllers/join-room-controller.js'
import { disconnectPlayer } from '../temporarly-database/rooms-management.js'

const startSocketServer = (fastify: FastifyInstance) => {

    const io = new Server(fastify.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        transports: ['websocket']
    })

    const pubClient = redisCluster.duplicate()
    const subClient = redisCluster.duplicate()

    io.adapter(createShardedAdapter(pubClient, subClient))

    io.on('connection', (socket) => {
        fastify.log.info(`[socket.io] connection - ${socket.id}`)

        socket.on('join-room', (data) => joinRoomController(socket, data))

        socket.on('disconnect', async () => {
            fastify.log.info(`[socket.io] disconnection - ${socket.id}`)
            await disconnectPlayer(socket.data.room, socket.data.username, socket.id)
        })
    })

    return io

}

export {
    startSocketServer,
}
