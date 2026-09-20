
const hostTokenSecret = process.env.HOST_TOKEN_SECRET || ""
const playerReconnectionTokenSecret = process.env.PLAYER_RECONNECTION_TOKEN_SECRET || ""
const playerAnsweringTokenSecret = process.env.PLAYER_ANSWERING_TOKEN_SECRET || ""

if (!(hostTokenSecret)) {
    throw new Error("HOST_TOKEN_SECRET is not configured")
}
if (!(playerReconnectionTokenSecret)) {
    throw new Error("PLAYER_RECONNECTION_TOKEN_SECRET is not configured")
}
if (!(playerAnsweringTokenSecret)) {
    throw new Error("PLAYER_ANSWERING_TOKEN_SECRET is not configured")
}

export {
    hostTokenSecret,
    playerReconnectionTokenSecret,
    playerAnsweringTokenSecret,
}
