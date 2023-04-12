import type { Actions } from './$types';
import { fork } from '$lib/api/server/fork';

export const actions: Actions = {
	logout({ locals }) {
		locals.pocketbase.authStore.clear();
	},
	fork,
};
