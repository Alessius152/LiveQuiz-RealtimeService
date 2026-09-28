import { createCluster } from 'redis'

const redisCluster = createCluster({
    rootNodes: [
        { url: 'redis://livequiz-RTservice-rediscluster-1:6379' },
        { url: 'redis://livequiz-RTservice-rediscluster-2:6379' },
        { url: 'redis://livequiz-RTservice-rediscluster-3:6379' },
        { url: 'redis://livequiz-RTservice-rediscluster-4:6379' },
        { url: 'redis://livequiz-RTservice-rediscluster-5:6379' },
        { url: 'redis://livequiz-RTservice-rediscluster-6:6379' }
    ],
    defaults: {
        socket: {
            connectTimeout: 10000,
            reconnectStrategy: (retries) => {
                if (retries > 10) {
                    return new Error('Impossibile connettersi al Redis Cluster');
                }
                return Math.min(retries * 500, 3000); // Riprova in modo incrementale
            }
        }
    }
})

redisCluster.on('error', (err) => {
    console.error('REDIS CLUSTER ERROR:', err)
})

redisCluster.on('connect', () => {
    console.log('REDIS CLUSTER CONNECT')
})

redisCluster.on('ready', () => {
    console.log('REDIS CLUSTER READY')
})

redisCluster.on('reconnecting', () => {
    console.log('REDIS CLUSTER RECONNECTING')
})

async function testCluster() {
    try {
        await redisCluster.set('test_key', 'it works!')
        const val = await redisCluster.get('test_key')
        console.log('redis cluster: test passed', val)
    } catch (error) {
        console.error('error during the redisCluster test', error)
    }
}

export {
    redisCluster,
    testCluster
}