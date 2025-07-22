import { z } from "zod";

export const QuizQuestionSchema = z.object({
    question: z.string(),
    answers: z.array(z.string()).min(2).max(4),
    correctAnswer: z.number().optional(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizPhaseSchema = z.enum(['WAITING', 'PLAY', 'END']);

export type QuizPhase = z.infer<typeof QuizPhaseSchema>;

// player and game schema are only used for client and transmission
// classes are used for the authoritative game state on the server
// the Light suffix indicates that they are not the real deal
export const QuizPlayerLightSchema = z.object({
    id: z.string(),
    name: z.string().max(16),
    score: z.number(),
    submittedAnswer: z.boolean()
});

export type QuizPlayerLight = z.infer<typeof QuizPlayerLightSchema>;

export const QuizGameLightSchema = z.object({
    id: z.string().max(6),
    players: z.array(QuizPlayerLightSchema),
    phase: QuizPhaseSchema,
    questionEndTime: z.number(),
    currentQuestionIndex: z.number(),
    questions: z.array(QuizQuestionSchema),
    totalQuestions: z.number()
});

export type QuizGameLight = z.infer<typeof QuizGameLightSchema>;

export const QuizMessageSchema = z.discriminatedUnion("kind", [
    z.object({
        kind: z.literal("ANSWER"),
        payload: z.number().min(0).max(3),
    }),
    z.object({
        kind: z.literal("GAME_STATE_UPDATE"),
        payload: QuizGameLightSchema,
    }),
    z.object({
        kind: z.literal("ERROR"),
        payload: z.string()
    }),
]);

export type QuizMessage = z.infer<typeof QuizMessageSchema>;

export const AuthHandshakeSchema = z.object({
    userId: z.uuid(),
    username: z.string().max(16),
    gameId: z.string().max(6)
});

export type AuthHandshake = z.infer<typeof AuthHandshakeSchema>;