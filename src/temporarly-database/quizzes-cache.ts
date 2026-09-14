
import { redisCluster } from "../config/redis.js"
import { CachedExistantQuiz } from "../types/quizzes-storage.js"
import { quizKey } from "./redis-keys-generators.js"

const saveQuiz = (quizStruct: CachedExistantQuiz) => {
    redisCluster.hset(quizKey(quizStruct.quiz[1]), ...['creatorId', quizStruct.quiz[0], ...quizStruct.questions])
}

const checkQuizExists = async (quizId: string): Promise<boolean> => {
    const result = await redisCluster.exists(quizKey(quizId))
    return result === 1
}

export {
    saveQuiz,
    checkQuizExists,
}
