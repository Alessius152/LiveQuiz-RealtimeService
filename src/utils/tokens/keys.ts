
const hostTokenSecret = process.env.HOST_TOKEN_SECRET || ""
const playerTokenSecret = process.env.PLAYER_TOKEN_SECRET || ""

if (!(hostTokenSecret)) {
    throw new Error("HOST_TOKEN_SECRET is not configured")
}
if (!(playerTokenSecret)) {
    throw new Error("PLAYER_TOKEN_SECRET is not configured")
}

export {
    hostTokenSecret,
    playerTokenSecret
}
