
import { redisCluster } from "../config/redis.js"
import { QuizNewVersionAvailableEvent } from "../types/kafka-events.js"
import { CachedExistantQuiz } from "../types/quizzes-storage.js"
import UPDATE_QUIZ_STRUCT_SCRIPT from "./lua-scripts/update-quiz-struct.js"
import { quizKey } from "./redis-keys-generators.js"

const saveQuiz = async (quizStruct: CachedExistantQuiz) => {
    const data = {
        metadata: quizStruct.quiz,
        questions: quizStruct.questions
    }
    await redisCluster.json.set(quizKey(quizStruct.quiz[1]), "$", data)
}

const checkQuizExists = async (quizId: string): Promise<boolean> => {
    const result = await redisCluster.exists(quizKey(quizId))
    return result === 1
}

const updateQuiz = async ({ quizId, releaseNumber, addedQuestions }: QuizNewVersionAvailableEvent) => {
    await redisCluster.eval(UPDATE_QUIZ_STRUCT_SCRIPT, {
        keys: [quizKey(quizId)],
        arguments: [`${releaseNumber}`, JSON.stringify(addedQuestions)]
    })
}

export {
    saveQuiz,
    checkQuizExists,
    updateQuiz,
}
