import type { Actions } from './$types';

export const actions: Actions = {
	logout({ locals }) {
		locals.poket_base.authStore.clear();
	}
};
