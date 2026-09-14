import { CreatedQuizEvent } from "./kafka-events.js"

type QuestionIndex = number
type QuestionContent = string /* { type: 0 | 1 | 2, options: Array<number>, answers: Array<number> } */

type ParsedCreatedQuizEventPayload = {
    quiz: CreatedQuizEvent['quiz'],
    questions: Array<QuestionIndex | QuestionContent>
}

type CachedExistantQuiz = ParsedCreatedQuizEventPayload

export type {
    CachedExistantQuiz,
    CreatedQuizEvent,
    ParsedCreatedQuizEventPayload,
    QuestionContent,
    QuestionIndex,
}
