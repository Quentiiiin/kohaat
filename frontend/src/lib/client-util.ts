import { PUBLIC_GAME_HTTP_URL } from "$env/static/public";
import type { QuizPhase } from "$shared/schema";

export async function getGameStatus(gameId: string, userId: string) {
    const res = await (fetch(PUBLIC_GAME_HTTP_URL + '/game-status/' + gameId + '/' + userId));
    if (!res.ok) {
        return {
            found: false,
            phase: 'END' as QuizPhase,
            userFound: false
        }
    } else {
        const json = await res.json();

        return {
            found: true,
            phase: json.phase as QuizPhase,
            userFound: json.userFound as boolean
        }
    }
}