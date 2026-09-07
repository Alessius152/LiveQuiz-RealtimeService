
import Redis from 'ioredis'

const redisCluster = new Redis.Cluster([
    { host: '172.32.0.11', port: 6379 },
    { host: '172.32.0.12', port: 6379 },
    { host: '172.32.0.13', port: 6379 },
    { host: '172.32.0.14', port: 6379 },
    { host: '172.32.0.15', port: 6379 },
    { host: '172.32.0.16', port: 6379 },
], {
    clusterRetryStrategy: (times) => Math.min(100 * times, 2000),
    enableReadyCheck: true,
    scaleReads: 'slave'
})

redisCluster.on('connect', () => {
    console.log('redis cluster connected!')
})

redisCluster.on('error', (err) => {
    console.error('redis cluster error:', err)
})

async function testCluster() {
    try {
        await redisCluster.set('test_key', 'it works!')
        const val = await redisCluster.get('test_key')

        console.log("redis cluster: test passed", val)
    } catch (error) {
        console.error("error during the redis cluster test", error)
    }
}

export {
    redisCluster,
    testCluster,
}
