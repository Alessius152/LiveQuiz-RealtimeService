import { createClient } from 'redis'

const bullmqRedisClient = createClient({
    socket: {
        host: 'livequiz-realtimeservice-redis-bullmq',
    }
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

        console.log('bullmqRedisClient: test passed', val)
    } catch (error) {
        console.error(
            'error during the bullmqRedisClient test',
            error
        )
    }
}

export {
    bullmqRedisClient,
    testBullmqRedis,
}