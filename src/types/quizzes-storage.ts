import { CreatedQuizEvent } from "./kafka-events.js"

type QuestionIndex = number
type QuestionContent = {
    type: 0 | 1 | 2
    options?: number[]
    answers?: number[]
}

type ParsedCreatedQuizEventPayload = {
    quiz: CreatedQuizEvent['quiz']
    questions: Record<number, QuestionContent>
}

type CachedExistantQuiz = ParsedCreatedQuizEventPayload

export type {
    CachedExistantQuiz,
    CreatedQuizEvent,
    ParsedCreatedQuizEventPayload,
    QuestionContent,
    QuestionIndex,
}
