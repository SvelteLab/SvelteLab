import { error, success } from '$lib/toast';
import { webcontainer } from '$lib/webcontainer';
import { get } from 'svelte/store';
import {
	repl_id,
	repl_name,
	is_repl_saving,
	is_repl_to_save,
	file_status,
} from '$lib/stores/repl_id_store';
import { stringify } from '$lib/components/parsers';

/**
 * This function does what it takes to save the repl, it set the state
 * of the saving, it recover the tree from the container, it does the fetch call
 * and it shows the toast on success or error.
 */
export async function save_repl() {
	const id = get(repl_id);
	const name = get(repl_name);
	if (name.length < 2) {
		error('The minimum name lenght is 2');
		return;
	}
	const files = await webcontainer.get_tree_from_container(false);
	is_repl_saving.set(true);
	const res = await fetch('./save-repl', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: stringify({
			files,
			id,
			name,
		}),
	});
	if (res.ok) {
		success('Saved');
		is_repl_to_save.set(false);
		file_status.reset_all_file_status();
		const created = await res.json();
		if (created.id && !id) {
			// if there wasn't an id means it's the first time
			// the user saves this project, we push with the
			// history api because we just want the url to change
			// there's no need to run the load function again
			window.history.pushState(null, '', `/${created.id}`);
			repl_id.set(created.id);
		}
	} else {
		error("Can't save the project");
	}
	is_repl_saving.set(false);
}
