import type { QuizGameLight } from "$shared/schema";

export const localGameState: {
    state: QuizGameLight | null,
    connected: boolean,
    userId: string
} = $state({ state: null, connected: false, userId: '' });
