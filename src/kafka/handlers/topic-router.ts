
import { EachMessagePayload } from "kafkajs"
import { CreatedQuizEvent } from "../../types/kafka-events.js"

import quizTopicHandlers from '../handlers/quiz-topic.js'

const handleKafkaEvent = ({ topic, partition, message }: EachMessagePayload) => {

    const headers = message.headers
    const value = message.value

    if (!(headers?.eventName && value)) {
        return
    }

    const eventName = headers.eventName.toString()

    if (topic === 'quiz-topic') {
        if (eventName === 'QuizCreatedEvent') {
            const parsed = JSON.parse(value.toString()) as CreatedQuizEvent
            console.log("<-:::parsed:::->", parsed)
            quizTopicHandlers.onCreateQuizEvent(parsed)
        }
    }

}

export {
    handleKafkaEvent,
}
