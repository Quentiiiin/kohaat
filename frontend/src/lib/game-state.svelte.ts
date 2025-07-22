import type { QuizGame } from "$shared/schema";

export const localGameState: {
    state: QuizGame | null,
    connected: boolean
} = $state({ state: null, connected: false });
