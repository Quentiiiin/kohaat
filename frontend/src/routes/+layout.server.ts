import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    let userId = cookies.get('kh-userId');
    if (!userId) {
        userId = crypto.randomUUID()
        cookies.set('kh-userId', userId, {
            path: '/',
            httpOnly: false,
        });
    }
    return {
        userId
    };
};