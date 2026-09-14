
const hostTokenSecret = process.env.HOST_TOKEN_SECRET || ""

if (!(hostTokenSecret)) {
    throw new Error("HOST_TOKEN_SECRET is not configured")
}

export {
    hostTokenSecret
}
