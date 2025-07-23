import type { QuizGameLight } from "$shared/schema";

export const localGameState: {
    state: QuizGameLight | null,
    connected: boolean,
    userId: string,
    latency: number
} = $state({ state: null, connected: false, userId: '', latency: -1 });
