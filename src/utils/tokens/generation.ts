
import { createHmac } from 'node:crypto'
import { hostTokenSecret, playerAnsweringTokenSecret, playerReconnectionTokenSecret } from './keys.js'

const appToken = (ePayload: string, signature: string) => `${ePayload}.${signature}`

const generateAnyoneAppToken = (payload: any, secret: string) => {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
    const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url")
    return appToken(encodedPayload, signature)
}

const createHostToken = (room: string) => generateAnyoneAppToken({
    type: "host",
    room,
    exp: Math.floor(Date.now() / 1000) + 60 * 5 /*5 minuti, perché?
        in teoria la partita dura molto di più,
        però il tempo di vita della partita inizia
        a consumarsi quando la partita vera viene
        inizializzata, la key room:123456 avrà, in
        redis, un ttl di 5 minuti, dopo l'evento 
        start-game, si ricalcolerà il ttl tenendo 
        conto del tempo di risposta di ogni domanda.
        
        TODO: Implementazione del TTL*/
}, hostTokenSecret)

const createPlayerReconnectionToken = (room: string, username: string, playerId: string, gameExp: number) => generateAnyoneAppToken({
    room,
    username,
    playerId,
    exp: gameExp
}, playerReconnectionTokenSecret)

const createPlayerAnsweringToken = (room: string, playerId: string, gameExp: number) => generateAnyoneAppToken({
    room,
    playerId,
    exp: gameExp
}, playerAnsweringTokenSecret)

export {
    createHostToken,
    createPlayerReconnectionToken,
    createPlayerAnsweringToken
}
