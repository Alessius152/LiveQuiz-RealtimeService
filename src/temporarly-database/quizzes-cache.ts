
import { redisCluster } from "../config/redis.js"
import { CachedExistantQuiz } from "../types/quizzes-storage.js"
import { quizKey } from "./redis-keys-generators.js"

const saveQuiz = async (quizStruct: CachedExistantQuiz) => {
    const data = {
        creatorId: quizStruct.quiz[0],
        questions: quizStruct.questions
    }
    await redisCluster.call("json.set", quizKey(quizStruct.quiz[1]), "$", JSON.stringify(data))
}

const checkQuizExists = async (quizId: string): Promise<boolean> => {
    const result = await redisCluster.exists(quizKey(quizId))
    return result === 1
}

export {
    saveQuiz,
    checkQuizExists,
}
