import { PUBLIC_GAME_HTTP_URL } from '$env/static/public';
import type { QuizPhase } from '$shared/schema';
import type { PageServerLoad } from './$types';

export const load = (async ({ params, cookies }) => {
    const gameId = params.slug;
    const userId = cookies.get('kh-userId') ?? 'nouser';

    const res = await fetch(PUBLIC_GAME_HTTP_URL + '/game-api/game-status/' + gameId + '/' + userId);
    if (!res.ok) {
        return {
            error: true
        }
    }
    const json = await res.json();

    return {
        error: false,
        gameId: gameId,
        phase: json.phase as QuizPhase,
        userFound: json.userFound as boolean,
    };
}) satisfies PageServerLoad;