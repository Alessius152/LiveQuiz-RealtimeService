
enum AppTokenValidationError {
    INVALID_STRUCTURE,
    INVALID_SIGNATURE,
    IS_NOT_HOST_TOKEN,
    TOKEN_HAS_EXPIRED,
}

type RoomHostTokenPayload = {
    type: "host",
    room: string,
    exp: number
}

type RoomPlayerTokenPayload = {
    room: string,
    username: string,
    playerId: string,
    exp: number
}

export {
    AppTokenValidationError
}

export type {
    RoomHostTokenPayload,
    RoomPlayerTokenPayload,
}
