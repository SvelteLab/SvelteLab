import { PUBLIC_THEME_COOKIE_NAME } from '$env/static/public';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { theme } = await request.json();
	if (theme) {
		cookies.set(PUBLIC_THEME_COOKIE_NAME, theme, { httpOnly: false, path: '/' });
	} else {
		cookies.delete(PUBLIC_THEME_COOKIE_NAME);
	}
	return new Response('Theme Cookie Set');
};
