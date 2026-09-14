
import zod from 'zod'

const joinRoomSchema = zod.object({
    username: zod.string()
        .min(1, { error: "username must be between 1 and 24 characters" })
        .max(24, { error: "username must be between 1 and 24 characters" })
        .optional(),
    room: zod.string()
        .regex(/^\d{6}$/, { error: "room code format is 6 numeric characters" }),

    recoveryToken: zod.string().optional()
})

export {
    joinRoomSchema
}
