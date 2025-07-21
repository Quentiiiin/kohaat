import type { QuizGame } from "$shared/schema";

export const localGameState: {state: QuizGame | null} = $state({state: null});
