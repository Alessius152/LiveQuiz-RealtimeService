
enum HostTokenValidationError {
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

export {
    HostTokenValidationError
}

export type {
    RoomHostTokenPayload
}
