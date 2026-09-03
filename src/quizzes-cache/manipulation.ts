
import { redisCluster } from "../redis/config.js"
import { CachedExistantQuiz } from "../types/realtime-room.js"

const saveQuiz = (quizStruct: CachedExistantQuiz) => { 

    console.log("<-:::quizStruct:::->", quizStruct)
    const key = `quiz:${quizStruct.quiz[0]}-${quizStruct.quiz[1]}`

    redisCluster.hset(key, ...quizStruct.questions)
    
}

export {
    saveQuiz
}
