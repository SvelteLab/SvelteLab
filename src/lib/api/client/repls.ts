import { error, success } from '$lib/toast';
import { webcontainer } from '$lib/webcontainer';
import { get } from 'svelte/store';
import {
	repl_id,
	repl_name,
	is_repl_saving,
	is_repl_to_save,
	file_status,
	repl_category,
} from '$lib/stores/repl_id_store';
import { stringify } from '$lib/components/parsers';
import { pushState } from '$app/navigation';
import { invalidate } from '$app/navigation';

/**
 * This function does what it takes to save the repl, it set the state
 * of the saving, it recover the tree from the container, it does the fetch call
 * and it shows the toast on success or error.
 */
export async function save_repl(is_forking = false) {
	const id = get(repl_id);
	const name = get(repl_name);
	const category = get(repl_category);
	if (name.length < 2) {
		error('The minimum name lenght is 2');
		return;
	}
	const files = await webcontainer.get_tree_from_container(false);
	is_repl_saving.set(!is_forking);
	const res = await fetch('./save-repl', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: stringify({
			files,
			id,
			name,
			is_forking,
			category,
		}),
	});
	if (res.ok) {
		success('Saved');
		invalidate('user:repls');
		is_repl_to_save.set(false);
		file_status.reset_all_file_status();
		const created = await res.json();
		if (created.id && (!id || is_forking)) {
			// if there wasn't an id (or there was one but we are forking)
			// means it's the first time the user saves this project,
			// we push with the history api because we just want the url
			// to change there's no need to run the load function again
			pushState(`/${created.id}`, {});
			repl_id.set(created.id);
		}
	} else {
		error("Can't save the project");
	}
	is_repl_saving.set(false);
}
