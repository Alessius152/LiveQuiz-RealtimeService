
import { redisCluster } from "../config/redis.js"
import { CachedExistantQuiz } from "../types/realtime-room.js"

const saveQuiz = (quizStruct: CachedExistantQuiz) => {

    const key = `quiz:${quizStruct.quiz[1]}`
    redisCluster.hset(key, ...['creatorId', quizStruct.quiz[0], ...quizStruct.questions])

}

const checkQuizExists = async (quizId: string): Promise<boolean> => {
    const key = `quiz:${quizId}`
    const result = await redisCluster.exists(key)
    return result === 1
}

export {
    saveQuiz,
    checkQuizExists,
}
