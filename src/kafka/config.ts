
import { Kafka } from 'kafkajs'
import os from 'os'
import { handleKafkaEvent } from './handlers/topic-router.js'

const kafka = new Kafka({
    clientId: os.hostname(),
    brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'consumers-group-0001' })

const connectKafka = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: 'quiz-topic', fromBeginning: true })

        await consumer.run({
            eachMessage: async (data) => handleKafkaEvent(data),
        })

        console.log("connected with kafka successfully!")
    }
    catch (error) {
        console.log("error connecting kafka", error)
    }
}

export {
    kafka, consumer, connectKafka
}
