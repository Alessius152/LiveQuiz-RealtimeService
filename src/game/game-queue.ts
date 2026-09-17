
import {Queue} from 'bullmq'
import { bullmqRedisClient } from '../config/redis-bullmq.js'

const gameFlowQueue = new Queue('game-flow-queue', {
    connection: bullmqRedisClient,
    prefix: '{game-flow-queue-management}',
})

export {
    gameFlowQueue
}
