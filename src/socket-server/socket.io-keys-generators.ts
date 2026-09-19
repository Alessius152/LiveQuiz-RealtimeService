
const socketIoRooms = {
    quizRoom: (room: string) => `quizroom:${room}`
}

const socketIoEvents = {
    JOIN_ROOM: 'join-room',
    RECOVERY_TOKEN: 'recovery-token',
    GAME_STARTED: 'game-started',
    QUIZ_FINISHED: 'quiz-finished',
    CURRENT_QUESTION_ADVANCED: 'current-question-advanced'
}

export {
    socketIoRooms,
    socketIoEvents,
}
