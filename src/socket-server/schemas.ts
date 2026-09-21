
import zod from 'zod'

const joinRoomSchema = zod.object({
    username: zod.string()
        .min(1, { error: "username must be between 1 and 24 characters" })
        .max(24, { error: "username must be between 1 and 24 characters" })
        .optional(),
    room: zod.string()
        .regex(/^\d{6}$/, { error: "room code format is 6 numeric characters" }),

    recoveryToken: zod.string().nonempty().optional()
})

const answerQuestionSchema = zod.object({
    answeringToken: zod.string().nonempty(),
    questionId: zod.number(),
    answer: zod.union([
        zod.number(),
        zod.string(),
        zod.array(zod.number()).nonempty()
    ])
})

export {
    joinRoomSchema,
    answerQuestionSchema
}
