
type PlayerJoinInput = { username: string, socket: string } /*questo type si usa quando un utente deve entrare in una stanza
e quindi servono solo i dati necessari affinché venga inizializzato*/

type PlayerStatus = {
    username: string,
}

type RealtimeRoomStatus = {
    code: string,
    quizId: string,
    status: 'waiting' | 'running',
    players: Array<PlayerStatus>
}

export type {
    RealtimeRoomStatus,
    PlayerJoinInput
}
