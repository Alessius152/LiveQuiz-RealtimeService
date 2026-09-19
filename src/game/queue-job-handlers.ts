
import { Job, JobProgress } from "bullmq"
import { BullmqJobDataType } from "../types/bullmq-job-data-types.js"
import { advanceGame } from "./functions.js"

type JobName = 'advance-game'
type QueueJob = Job<any, any, string, JobProgress>

const queueJobHandlersMap: Map<JobName, (job: QueueJob) => any | Promise<any>> = new Map()

queueJobHandlersMap.set('advance-game', async (job) => {

    const { roomCode, expectedCurrentQuestion } = job.data as BullmqJobDataType['advanceGame']

    await advanceGame(roomCode, expectedCurrentQuestion)

})

export {
    JobName,
    queueJobHandlersMap
}
