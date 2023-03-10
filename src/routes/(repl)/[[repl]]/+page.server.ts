import type { Actions } from './$types';

export const actions: Actions = {
	logout({ locals }) {
		locals.pocketbase.authStore.clear();
	}
};
