
import Fastify from 'fastify'
import { testCluster } from './redis/config.js'
import { connectKafka } from './kafka/config.js'

const server = Fastify({ logger: true })

const start = async () => {
    try {
        await server.listen({ port: Number(process.env.SERVER_PORT), host: process.env.SERVER_HOST })
    }
    catch (err) {
        server.log.error({ err }, "error starting server")
        process.exit(1)
    }
}

(async ()=>{
    await testCluster()
    await connectKafka()
    await start()
})()
