
import { Worker } from 'bullmq'
import { bullmqRedisClient } from '../config/redis-bullmq.js'
import { JobName, queueJobHandlersMap } from './queue-job-handlers.js'

const gameFlowWorker = new Worker(
    'game-flow-queue',
    async (job) => {
        const handler = queueJobHandlersMap.get(job.name as JobName)

        if (!handler) {
            console.log('>>> HANDLER NON TROVATO:', job.name)
            return
        }

        await handler(job)
    },
    {
        connection: bullmqRedisClient,
        prefix: '{game-flow-queue-management}',
    }
)

gameFlowWorker.on('ready', () => {
    console.log('>>> GAME FLOW WORKER READY')
})

gameFlowWorker.on('active', (job) => {
    console.log('>>> JOB ACTIVE:', job.id)
})

gameFlowWorker.on('completed', (job) => {
    console.log(`>>> Job ${job.id} completato`)
})

gameFlowWorker.on('failed', (job, error) => {
    console.error(`>>> Job ${job?.id} fallito:`, error)
})

gameFlowWorker.on('error', (error) => {
    console.error('>>> GAME FLOW WORKER ERROR:', error)
})
export {
    gameFlowWorker
}
