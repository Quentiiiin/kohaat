import type { QuizGameLight } from "$shared/schema";

export const localGameState: {
    state: QuizGameLight | null,
    connected: boolean,
    userId: string,
    latency: number,
    showKickedMessage: boolean
} = $state({ state: null, connected: false, userId: '', latency: -1, showKickedMessage: false });
