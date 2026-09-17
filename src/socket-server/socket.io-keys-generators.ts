
const socketIoRooms = {
    quizRoom: (room: string) => `quizroom:${room}`
}

const socketIoEvents = {
    JOIN_ROOM: 'join-room',
    RECOVERY_TOKEN: 'recovery-token',
    GAME_STARTED: 'game-started',
}

export {
    socketIoRooms,
    socketIoEvents,
}
