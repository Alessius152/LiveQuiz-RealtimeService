import { CreatedQuizEvent } from "./kafka-events.js"

type QuestionIndex = number
type QuestionContent = string /* { type: 0 | 1 | 2, options: Array<number>, answers: Array<number> } */

type ParsedCreatedQuizEventPayload = {
    quiz: CreatedQuizEvent['quiz'],
    questions: Array<QuestionIndex | QuestionContent>
}

type CachedExistantQuiz = ParsedCreatedQuizEventPayload

type RoomPlayer = {
    username: string
}

type RealtimeRoomStatus = {
    code: number,
    status: 'waiting' | 'running',
    players: Array<RoomPlayer>
}

export type {
    ParsedCreatedQuizEventPayload,
    CachedExistantQuiz,
    RealtimeRoomStatus,
}
