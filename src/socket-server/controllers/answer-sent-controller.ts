
import { Socket } from "socket.io"
import { answerQuestionSchema } from "../schemas.js"
import { isPlayerAnsweringTokenValidationError, verifyPlayerAnsweringToken } from "../../utils/tokens/validation.js"
import { registerPlayerAnswer } from "../../temporarly-database/rooms-management.js"

const handleAnswerSentController = async (socket: Socket, data: unknown) => {

    const validation = answerQuestionSchema.safeParse(data)

    if (!validation.success) {
        return
    }

    const { answeringToken, questionId, answer } = validation.data
    const tokenCheck = verifyPlayerAnsweringToken(answeringToken)

    if (isPlayerAnsweringTokenValidationError(tokenCheck)) {
        return
    }

    const { room, playerId } = tokenCheck
    const result = await registerPlayerAnswer(room, socket.id, playerId, questionId, answer)

    if (
        (result === "INVALID_ANSWER") 
        || (result === "PLAYER_IS_NOT_PLAYING") 
        || (result === "ROOM_NOT_FOUND") 
        || (result === "UNABLE_TO_WRITE_STATUS_OF_ANOTHER_USER") 
        || (result === "UNPROCESSABLE_QUESTION")
        || (result === "ALREADY_ANSWERED")
    ) {
        return
    } 

}

export {
    handleAnswerSentController
}
