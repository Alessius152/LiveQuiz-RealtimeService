
import { Kafka } from 'kafkajs'
import os from 'os'
import { handleKafkaEvent } from '../broker-handlers/topic-router.js'

const kafkaTopics = {
    QUIZ_TOPIC: 'quiz-topic',
    ANALYTICS_TOPIC: 'analytics-topic',
}

const kafka = new Kafka({
    clientId: os.hostname(),
    brokers: ['kafka:9092']
})

const consumer = kafka.consumer({ groupId: 'consumers-group-0001' })
const producer = kafka.producer()

const connectKafka = async () => {
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: kafkaTopics.QUIZ_TOPIC, fromBeginning: true })
        await producer.connect()
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
    kafkaTopics, kafka, consumer, producer, connectKafka
}
