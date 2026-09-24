import { getIO } from "../global/ioInstance.js"
import { socketIoEvents, socketIoRooms } from "../socket-server/socket.io-keys-generators.js"
import { advanceCurrentQuestion } from "../temporarly-database/rooms-management.js"
import { BullmqJobDataType } from "../types/bullmq-job-data-types.js"
import { gameFlowQueue } from "./game-queue.js"
import { gameQueueJobKeys } from "./job-keys.js"

const advanceGame = async (roomCode: string, expectedCurrentQuestion: null | number) => {

    const setting = await advanceCurrentQuestion(roomCode, expectedCurrentQuestion)
    
    if ((setting === 'CURRENT_QUESTION_NOT_FOUND') || (setting === 'ROOM_NOT_FOUND') || (setting === 'STALE_JOB')) {
        return
    }

    if (setting === 'QUIZ_FINISHED') {
        getIO().to(socketIoRooms.quizRoom(roomCode)).emit(socketIoEvents.QUIZ_FINISHED)
        return
    }

    if (Array.isArray(setting)) {

        const [questionId, questionTimeout, openedAt] = setting

        getIO().to(socketIoRooms.quizRoom(roomCode)).emit(socketIoEvents.CURRENT_QUESTION_ADVANCED, {
            id: questionId, 
            timeout: questionTimeout,
            openedAt
        })

        await gameFlowQueue.add(gameQueueJobKeys.ADVANCE_GAME, {
            roomCode: roomCode,
            expectedCurrentQuestion: questionId /* questo parametro ha un motivo preciso:
            il fatto che un job possa arrivare tardi.
            E' vero che tra una domanda e l'altra ci sono minimo 30 secondi di attesa,
            ma il concetto da evitare è che Redis esegua alla cieca l'advance della
            currentQuestion.

            Se mi porto dietro l'expectedCurrentQuestion posso fare l'avanzamento
            in sicurezza perché, in caso di retry, esecuzione duplicata del job o
            ritardo nell'esecuzione, il valore presente in Redis potrebbe non
            coincidere più con quello atteso dal job.

            Questo è particolarmente importante perché Redis è la source of truth
            assoluta per lo stato della stanza: il job può diventare obsoleto,
            ma non deve mai poter modificare uno stato che nel frattempo è cambiato.
            */
        } as BullmqJobDataType['advanceGame'], {
            delay: questionTimeout * 1000
        })

    }

}

export {
    advanceGame
}
