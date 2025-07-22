import { PUBLIC_GAME_HTTP_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async (event) => {
        const data = await event.request.formData();
        const userId = data.get('userId');
        const res = await fetch(PUBLIC_GAME_HTTP_URL + '/create', {
            method: 'POST', body: JSON.stringify({
                userId
            })
        });
        if (!res.ok) return;
        const json = await res.json();
        const gameId = await json.gameId;

        redirect(303, '/' + gameId);
    }
} satisfies Actions;