
import { FastifyInstance } from 'fastify'
import { Server } from 'socket.io'
import { redisCluster } from '../config/redis.js'
import { createShardedAdapter } from '@socket.io/redis-adapter'
import { joinRoomController } from './controllers/join-room-controller.js'
import { disconnectPlayer } from '../temporarly-database/rooms-management.js'
import { socketIoEvents } from './socket.io-keys-generators.js'
import { handleAnswerSentController } from './controllers/answer-sent-controller.js'

const startSocketServer = async (fastify: FastifyInstance) => {
    console.log("bootstrap 5.1")
    const io = new Server(fastify.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
        transports: ['websocket']
    })

    const pubClient = redisCluster.duplicate()
    const subClient = redisCluster.duplicate()
    console.log("bootstrap 5.2")

    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ])
    console.log("bootstrap 5.3")

    io.adapter(createShardedAdapter(pubClient, subClient))

    console.log("bootstrap 5.4")
    io.on('connection', (socket) => {
        fastify.log.info(`[socket.io] connection - ${socket.id}`)

        socket.on(socketIoEvents.JOIN_ROOM, (data) => joinRoomController(socket, data))

        socket.on(socketIoEvents.ANSWER_SENT, (data) => handleAnswerSentController(socket, data))

        socket.on('disconnecting', async ()=>{
            const {rooms} = socket
            
            for(const room of rooms){
                if(room.startsWith('quizroom:')){
                    io.to(room).emit(socketIoEvents.MEMBER_DISCONNECTED, {username: socket.data.username})
                }
            }
        })

        socket.on('disconnect', async () => {
            fastify.log.info(`[socket.io] disconnection - ${socket.id}`)

            if(! (socket.data.room && socket.data.username)){
                return
            }
            
            await disconnectPlayer(socket.data.room, socket.data.username, socket.id)

        })
    })

    console.log("bootstrap 5.5")
    return io

}

export {
    startSocketServer,
}
