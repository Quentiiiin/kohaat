import { PUBLIC_GAME_HTTP_URL } from '$env/static/public';
import type { QuizPhase } from '$shared/schema';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const gameId = params.slug;

    const res = await fetch(PUBLIC_GAME_HTTP_URL + '/game-status/' + gameId);
    if (!res.ok) {
        return {
            error: true
        }
    }
    const json = await res.json();

    return {
        error: false,
        gameId: gameId,
        phase: json.phase as QuizPhase
    };
}) satisfies PageServerLoad;