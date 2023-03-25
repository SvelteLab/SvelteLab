import { page } from '$app/stores';
import { save_repl } from '$lib/api/client/repls';
import { is_dir } from '$lib/file_system';
import { open_file } from '$lib/tabs';
import type { Command } from '$lib/types';
import { files } from '$lib/webcontainer';
import type { FileSystemTree } from '@webcontainer/api';
import { derived, type Readable } from 'svelte/store';
import AddRoute from './commands_components/AddRoute.svelte';
import { get_theme } from '$lib/theme';
import Save from '~icons/material-symbols/save';
import Fork from '~icons/material-symbols/fork-right-rounded';
import Route from '~icons/material-symbols/alt-route-rounded';
import Themes from '~icons/material-symbols/routine';

function get_files_from_tree(tree: FileSystemTree, path = './') {
	const files = [] as { file: string; path: string }[];
	for (const file_or_dir in tree) {
		const current_file = tree[file_or_dir];
		const current_path = `${path}${file_or_dir}`;
		if (is_dir(current_file)) {
			files.push(...get_files_from_tree(current_file.directory, `${current_path}/`));
			continue;
		}
		files.push({ file: file_or_dir, path: current_path });
	}
	return files;
}

type KnownCommands = 'fork' | 'save';

type AutocompletableString = KnownCommands | Omit<string, KnownCommands>;

const commands_callbacks = new Map<AutocompletableString, Set<() => void>>();

export function on_command(command: AutocompletableString, callback: () => void) {
	if (!commands_callbacks.has(command)) {
		commands_callbacks.set(command, new Set());
	}
	commands_callbacks.get(command)?.add(callback);
	return () => {
		commands_callbacks.get(command)?.delete(callback);
	};
}

export const commands: Readable<Command[]> = derived([files, page], ([$files, $page]) => {
	// ADD OPENING FILES TO COMMANDS
	const files = get_files_from_tree($files);
	const commands_to_return: Command[] = files.map((file) => ({
		title: `${file.file}`,
		subtitle: file.path,
		action() {
			open_file(file.path);
		}
	}));

	// ADD SAVE TO COMMANDS
	if ($page.data.user) {
		if (!$page.data.owner_id || $page.data.user.id === $page.data.owner_id) {
			commands_to_return.push({
				command: 'save',
				title: 'Save',
				subtitle: 'save the current project',
				icon: Save,
				action() {
					save_repl();
				}
			});
		}
		if ($page.data.id) {
			commands_to_return.push({
				command: 'fork',
				title: 'Fork',
				subtitle: 'fork the current project',
				icon: Fork,
				action() {
					commands_callbacks.get('fork')?.forEach((callback) => {
						if (typeof callback === 'function') callback();
					});
				}
			});
		}
	}

	// ADD CREATE ROUTE
	commands_to_return.push({
		command: 'create-route',
		title: 'Create route',
		subtitle: 'create a new sveltekit route',
		icon: Route,
		action_component: AddRoute
	});

	// ADD SWITCH THEME
	commands_to_return.push({
		command: 'switch-theme',
		title: 'Switch Theme',
		subtitle: 'switch the theme',
		icon: Themes,
		action() {
			get_theme().change_preference();
		}
	});

	// ADD REMOVE PREFERENCE
	commands_to_return.push({
		command: 'remove-theme-preference',
		title: 'Remove Theme Preference',
		subtitle: 'use OS preference',
		icon: Themes,

		action() {
			get_theme().remove_preference();
		}
	});

	return commands_to_return;
});
