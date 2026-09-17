
import { Server } from 'socket.io'

let io: Server

const setIO = (server: Server) => {
    io = server
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO has not been initialized')
    }

    return io
}

export {
    setIO,
    getIO
}