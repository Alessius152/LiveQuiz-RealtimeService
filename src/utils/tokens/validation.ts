import { createHmac } from "node:crypto"
import { hostTokenSecret, playerAnsweringTokenSecret, playerReconnectionTokenSecret } from "./keys.js"
import { AppTokenValidationError, RoomHostTokenPayload, RoomPlayerAnsweringTokenPayload, RoomPlayerReconnectionTokenPayload } from "./types.js"

type DecodedTokenPayloads = RoomHostTokenPayload | RoomPlayerReconnectionTokenPayload | RoomPlayerAnsweringTokenPayload

const verifyAnyoneAppToken = <DecodedToken extends DecodedTokenPayloads>(token: string, secret: string) => {
    const [encodedPayload, receivedSignature] = token.split('.')
    if (!(encodedPayload.trim() && receivedSignature.trim())) {
        return AppTokenValidationError.INVALID_STRUCTURE
    }

    const expectedSignature = createHmac('sha256', secret).update(encodedPayload).digest('base64url')
    if (receivedSignature !== expectedSignature) {
        return AppTokenValidationError.INVALID_SIGNATURE
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as DecodedToken
    const currentTime = Math.floor(Date.now() / 1000)
    if (payload.exp < currentTime) {
        return AppTokenValidationError.TOKEN_HAS_EXPIRED
    }

    return payload
}

const verifyHostToken = (token: string): AppTokenValidationError | RoomHostTokenPayload => verifyAnyoneAppToken<RoomHostTokenPayload>(token, hostTokenSecret)
const isHostTokenValidationError = (value: AppTokenValidationError | RoomHostTokenPayload): value is AppTokenValidationError => typeof value === 'number'

const verifyPlayerReconnectionToken = (token: string): AppTokenValidationError | RoomPlayerReconnectionTokenPayload => verifyAnyoneAppToken(token, playerReconnectionTokenSecret)
const isPlayerReconnectionTokenValidationError = (value: AppTokenValidationError | RoomPlayerReconnectionTokenPayload): value is AppTokenValidationError => typeof value === 'number'

const verifyPlayerAnsweringToken = (token: string): AppTokenValidationError | RoomPlayerAnsweringTokenPayload => verifyAnyoneAppToken(token, playerAnsweringTokenSecret)
const isPlayerAnsweringTokenValidationError = (value: AppTokenValidationError | RoomPlayerAnsweringTokenPayload): value is AppTokenValidationError => typeof value === 'number'

export {
    verifyHostToken,
    isHostTokenValidationError,

    verifyPlayerReconnectionToken,
    isPlayerReconnectionTokenValidationError,

    verifyPlayerAnsweringToken,
    isPlayerAnsweringTokenValidationError
}
