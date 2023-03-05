import type { PageServerLoad } from './(inited_webcontainer)/$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};
