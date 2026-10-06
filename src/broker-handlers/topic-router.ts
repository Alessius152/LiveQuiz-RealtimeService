
import { EachMessagePayload } from "kafkajs"
import { CreatedQuizEvent, QuizNewVersionAvailableEvent } from "../types/kafka-events.js"
import quizTopicHandlers from './topics/quiz-topic.js'

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
            quizTopicHandlers.onCreateQuizEvent(parsed)
        }
        else if (eventName === 'QuizNewVersionAvailableEvent'){
            const parsed = JSON.parse(value.toString()) as QuizNewVersionAvailableEvent
            quizTopicHandlers.onNewQuizVersionAvailableEvent(parsed)
        }
    }

}

export {
    handleKafkaEvent,
}
