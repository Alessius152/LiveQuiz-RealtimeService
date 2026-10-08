import { CreatedQuizEvent } from "./kafka-events.js"

type QuestionIndex = number
type QuestionContent = {
    type: 0 | 1 | 2
    options: Array<number> | null
    answers: Array<number> | null
}

type ParsedCreatedQuizEventPayload = {
    metadata: CreatedQuizEvent['quiz']
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
