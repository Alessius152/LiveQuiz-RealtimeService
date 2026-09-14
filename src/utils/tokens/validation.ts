import { createHmac } from "node:crypto"
import { hostTokenSecret, playerTokenSecret } from "./keys.js"
import { AppTokenValidationError, RoomHostTokenPayload, RoomPlayerTokenPayload } from "./types.js"

const verifyHostToken = (token: string): AppTokenValidationError | RoomHostTokenPayload => {
    const [encodedPayload, receivedSignature] = token.split('.')
    if (!(encodedPayload.trim() && receivedSignature.trim())) {
        return AppTokenValidationError.INVALID_STRUCTURE
    }

    const expectedSignature = createHmac('sha256', hostTokenSecret).update(encodedPayload).digest('base64url')
    if (receivedSignature !== expectedSignature) {
        return AppTokenValidationError.INVALID_SIGNATURE
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as RoomHostTokenPayload
    // if(payload.type !== "host"){
    //     return AppTokenValidationError.IS_NOT_HOST_TOKEN
    // } 
    /*dal momento che ogni token che firmo con il secret HOST_TOKEN_SECRET, ha il payload ha la proprietà type
    che riceve l'unico possibile valore di "host", qui non c'è bisogno di verificare l'uguaglianza tra i due,
    perché già il fatto che il server riesca a dire che la signature è valida, già mi assicura questo.*/

    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp < currentTime) {
        return AppTokenValidationError.TOKEN_HAS_EXPIRED
    }

    return payload
}

const isHostTokenValidationError = (
    value: AppTokenValidationError | RoomHostTokenPayload
): value is AppTokenValidationError => {
    return typeof value === 'number'
}

const verifyPlayerToken = (token: string): AppTokenValidationError | RoomPlayerTokenPayload => {
    const [encodedPayload, receivedSignature] = token.split('.')
    if (!(encodedPayload.trim() && receivedSignature.trim())) {
        return AppTokenValidationError.INVALID_STRUCTURE
    }

    const expectedSignature = createHmac("sha256", playerTokenSecret).update(encodedPayload).digest("base64url")
    if (receivedSignature !== expectedSignature) {
        return AppTokenValidationError.INVALID_SIGNATURE
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as RoomPlayerTokenPayload
    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp < currentTime) {
        return AppTokenValidationError.TOKEN_HAS_EXPIRED
    }

    return payload
}

const isPlayerTokenValidationError = (
    value: AppTokenValidationError | RoomPlayerTokenPayload
): value is AppTokenValidationError => {
    return typeof value === 'number'
}

export {
    verifyHostToken,
    isHostTokenValidationError,
    verifyPlayerToken,
    isPlayerTokenValidationError
}
