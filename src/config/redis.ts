import Redis from 'ioredis'

const redisCluster = new Redis.Cluster([
    { host: 'livequiz-RTservice-rediscluster-1', port: 6379 },
    { host: 'livequiz-RTservice-rediscluster-2', port: 6379 },
    { host: 'livequiz-RTservice-rediscluster-3', port: 6379 },
    { host: 'livequiz-RTservice-rediscluster-4', port: 6379 },
    { host: 'livequiz-RTservice-rediscluster-5', port: 6379 },
    { host: 'livequiz-RTservice-rediscluster-6', port: 6379 },
], {
    clusterRetryStrategy: (times) => Math.min(times * 100, 3000),
    scaleReads: 'slave',
    shardedSubscribers: true
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

async function waitForRedisClusterReady() {
    if (redisCluster.status === 'ready') {
        return
    }

    await new Promise<void>((resolve, reject) => {
        redisCluster.once('ready', resolve)
        redisCluster.once('error', reject)
    })
}

export {
    redisCluster,
    waitForRedisClusterReady,
    testCluster,
}

// redis-cli --cluster call localhost:6379 keys '*' per avere tutte le chiavi del cluster