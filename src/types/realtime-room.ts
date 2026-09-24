import { ParsedCreatedQuizEventPayload } from "./quizzes-storage.js"

type PlayerStatus = {
    username: string,
    socketId: string | null,
    playerId: string,
    score: number
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
    currentQuestion: null | "finished" | {
        id: number,
        openedAt: number, /*serve a calcolare quanto ci mette un player a rispondere a una domanda*/
    } /*indica la domanda corrente*/,
    answersHistory: Record<number, Record<string, Array<number> | number | string>> /*
    l'idea è che io voglio una struttura del genere:
    {
        [id_domanda_1]: {
            [player_id_1]: { answer: 1, answeredAt: 1789833016893 },
        },
        [id_domanda_2]: {
            [player_id_1]: { answer: [1], answeredAt: 1789833042371 },
        },
        [id_domanda_3]: {
            [player_id_1]: {
                answer: "Il contesto ci porta a pensare ...",
                answeredAt: 1789833077510
            },
        },
    }
    così riesco a tenere traccia:
        - chi risponde e chi no a una determinata domanda
        - cosa ha risposto ogni player
        - quando ha risposto ogni player
        - il tempo impiegato dal player per rispondere
    */
}

export type {
    PlayerStatus,
    RealtimeRoomStatus,
}
