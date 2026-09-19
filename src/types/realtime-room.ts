import { ParsedCreatedQuizEventPayload } from "./quizzes-storage.js"

type PlayerJoinInput = { username: string, socket: string, playerId: string } /*questo type si usa quando un utente deve entrare in una stanza
e quindi servono solo i dati necessari affinché venga inizializzato*/

type PlayerStatus = {
    username: string,
    socketId: string | null,
    playerId: string,
}

type ImmutableQuizSnapshot = ParsedCreatedQuizEventPayload

type RealtimeRoomStatus = {
    code: string,
    immutableQuizSnapshot: ImmutableQuizSnapshot['questions'],
    status: 'waiting' | 'running',
    players: Array<PlayerStatus>,
    questionsOrder: Array<number> /*questo array semplicemente spiega
    l'ordine in cui le domande verranno estratte.
    Questo permette al creatore di impostare anche un ordinamento
    casuale, che avverrebbe semplicemente facendo uno shuffle dell'
    array prima di fare la game-started*/,
    currentQuestion: null | number /*indica la domanda corrente*/
}

export type {
    RealtimeRoomStatus,
    PlayerJoinInput
}
