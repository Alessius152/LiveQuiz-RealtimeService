import { CreatedQuizEvent } from "./kafka-events.js"

type QuestionIndex = number

type ParsedCreatedQuizEventPayload = {
    quiz: CreatedQuizEvent['quiz'],
    questions: Array<QuestionIndex | string /*{
        type: 0 | 1 | 2,
        options: Array<number>,
        answers: Array<number>
    }*/>
}

type CachedExistantQuiz = ParsedCreatedQuizEventPayload

export type {
    ParsedCreatedQuizEventPayload,
    CachedExistantQuiz,
}
