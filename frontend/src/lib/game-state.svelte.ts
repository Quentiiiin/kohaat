import type { QuizGameLight } from "$shared/schema";

export const localGameState: {
    state: QuizGameLight | null,
    connected: boolean
} = $state({ state: null, connected: false });
