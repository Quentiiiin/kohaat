import { z } from "zod";

export const QuizQuestionSchema = z.object({
    question: z.string(),
    answers: z.array(z.string()),
    correctAnswer: z.number().optional(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const QuizPlayerSchema = z.object({
    id: z.string(),
    name: z.string().max(16),
    givenAnswers: z.array(z.number()),
    answerTimeDelta: z.array(z.number()),
    isConnected: z.boolean(),
    score: z.number(),
});

export type QuizPlayer = z.infer<typeof QuizPlayerSchema>;

export const QuizGameSchema = z.object({
    id: z.string().max(6),
    players: z.array(QuizPlayerSchema),
    questions: z.array(QuizQuestionSchema),
    hasStarted: z.boolean(),
    currentQuestionIndex: z.number(),
});

export type QuizGame = z.infer<typeof QuizGameSchema>;

export const QuizMessageSchema = z.discriminatedUnion("kind", [
    z.object({
        kind: z.literal("ANSWER"),
        payload: z.number().min(0),
    }),
    z.object({
        kind: z.literal("GAME_STATE_UPDATE"),
        payload: QuizGameSchema,
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