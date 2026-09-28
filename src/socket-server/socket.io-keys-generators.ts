
const socketIoRooms = {
    quizRoom: (room: string) => `quizroom:${room}`
}

const socketIoEvents = {
    JOIN_ROOM: 'join-room',
    ENTERED_SUCCESSFULLY: 'entered-successfully',
    GAME_STARTED: 'game-started',
    QUIZ_FINISHED: 'quiz-finished',
    CURRENT_QUESTION_ADVANCED: 'current-question-advanced',
    ANSWER_SENT: 'answer-sent',
    NEW_PLAYER_JOINED: 'new-player-joined',
    MEMBER_DISCONNECTED: 'member-disconnected'
}

export {
    socketIoRooms,
    socketIoEvents,
}
