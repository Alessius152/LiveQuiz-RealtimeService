import { ParsedCreatedQuizEventPayload } from "./quizzes-storage.js"

type PlayerJoinInput = { username: string, socket: string, playerId: string } /*questo type si usa quando un utente deve entrare in una stanza
e quindi servono solo i dati necessari affinché venga inizializzato*/

type PlayerStatus = {
    username: string,
    socketId: string | null,
    playerId: string
}

type ImmutableQuizSnapshot = ParsedCreatedQuizEventPayload

type RealtimeRoomStatus = {
    code: string,
    immutableQuizSnapshot: ImmutableQuizSnapshot['questions'],
    status: 'waiting' | 'running',
    players: Array<PlayerStatus>
}

export type {
    RealtimeRoomStatus,
    PlayerJoinInput
}
