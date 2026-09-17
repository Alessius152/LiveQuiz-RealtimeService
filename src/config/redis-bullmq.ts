
import Redis from 'ioredis'

const bullmqRedisClient = new Redis.Redis({
    host: 'livequiz-realtimeservice-redis-bullmq',
    maxRetriesPerRequest: null
})

bullmqRedisClient.on('connect', () => {
    console.log('bullmqRedisClient connected!')
})

bullmqRedisClient.on('ready', () => {
    console.log('bullmqRedisClient ready!')
})

bullmqRedisClient.on('error', (err) => {
    console.error('bullmqRedisClient error:', err)
})

async function testBullmqRedis() {
    try {
        await bullmqRedisClient.set('test_key', 'it works!')
        const val = await bullmqRedisClient.get('test_key')
        console.log("bullmqRedisClient: test passed", val)
    } catch (error) {
        console.error("error during the bullmqRedisClient test", error)
    }
}

export {
    bullmqRedisClient,
    testBullmqRedis,
}
