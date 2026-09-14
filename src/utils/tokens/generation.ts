
import { createHmac, Hmac } from 'node:crypto'
import { hostTokenSecret, playerTokenSecret } from './keys.js'

const appToken = (ePayload: string, signature: string) => `${ePayload}.${signature}`

const createHostToken = (room: string) => {
    const payload = {
        type: "host",
        room,
        exp: Math.floor(Date.now() / 1000) + 60 * 5 /*5 minuti, perché?
        in teoria la partita dura molto di più,
        però il tempo di vita della partita inizia
        a consumarsi quando la partita vera viene
        inizializzata, la key room:123456 avrà, in
        redis, un ttl di 5 minuti, dopo l'evento 
        start-game, si ricalcolerà il ttl tenendo 
        conto del tempo di risposta di ogni domanda.*/
    }

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
    const signature = createHmac("sha256", hostTokenSecret).update(encodedPayload).digest("base64url")

    return appToken(encodedPayload, signature)
}

const createPlayerToken = (room: string, username: string, playerId: string, gameExp: number) => {
    const payload = {
        room,
        username,
        playerId,
        exp: gameExp
    }

    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url")
    const signature = createHmac("sha256", playerTokenSecret).update(encodedPayload).digest("base64url")

    return appToken(encodedPayload, signature)
}

export {
    createHostToken,
    createPlayerToken,
}
