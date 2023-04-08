import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { PUBLIC_DISCORD_INVITE, PUBLIC_GITHUB_REPO } from '$env/static/public';
import { save_repl } from '$lib/api/client/repls';
import { open_credits } from '$lib/components/Credits.svelte';
import { is_dir } from '$lib/file_system';
import { share_with_hash, share_with_id } from '$lib/share';
import { editor_config } from '$lib/stores/editor_config_store';
import { intro_hidden_forever, is_intro_open } from '$lib/stores/intro_store';
import { layout_store } from '$lib/stores/layout_store';
import { current_tab, open_file } from '$lib/tabs';
import { get_theme } from '$lib/theme';
import { error } from '$lib/toast';
import type { Command } from '$lib/types';
import { files, webcontainer } from '$lib/webcontainer';
import type { FileSystemTree } from '@webcontainer/api';
import { derived, get, type Readable } from 'svelte/store';
import Profile from '~icons/material-symbols/account-circle';
import New from '~icons/material-symbols/add-rounded';
import Route from '~icons/material-symbols/alt-route-rounded';
import Format from '~icons/material-symbols/cleaning-services';
import ConfigFiles from '~icons/material-symbols/display-settings-outline-rounded';
import Download from '~icons/material-symbols/download-rounded';
import Sorting from '~icons/material-symbols/drive-folder-upload-outline-rounded';
import Issue from '~icons/material-symbols/error-circle-rounded';
import Fork from '~icons/material-symbols/fork-right-rounded';
import NPM from '~icons/material-symbols/install-desktop';
import Keyboard from '~icons/material-symbols/keyboard';
import Themes from '~icons/material-symbols/routine';
import Save from '~icons/material-symbols/save';
import Share from '~icons/material-symbols/share';
import Bookmark from '~icons/material-symbols/star-outline';
import Intro from '~icons/material-symbols/waving-hand-rounded';
import Discord from '~icons/mdi/discord';
import GitHub from '~icons/mdi/github';
import Credits from '~icons/mdi/license';
import SvelteAddIcon from '~icons/sveltelab/svelte-add';
import AddRoute from './commands_components/AddRoute.svelte';
import NpmInstall from './commands_components/NpmInstall.svelte';
import SaveStartTemplate from './commands_components/SaveStartTemplate.svelte';
import StartTemplate from './commands_components/StartTemplate.svelte';
import SvelteAdd from './commands_components/SvelteAdd.svelte';

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

function run_callbacks(kind: KnownCommands) {
	commands_callbacks.get(kind)?.forEach((callback) => {
		if (typeof callback === 'function') callback();
	});
}

async function prettier_action() {
	const $current_tab = get(current_tab);
	const process = await webcontainer.spawn(`prettier`, ['--write', $current_tab]);
	const code = await process.exit;
	if (code === 0) {
		run_callbacks('format-current');
	} else {
		error('Something went wrong prettyifing this file!');
	}
}

type KnownCommands = 'fork' | 'save' | 'format-current';

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

	commands_to_return.push({
		command: 'format-current',
		title: 'Format',
		subtitle: 'prettier current file',
		icon: Format,
		action: prettier_action,
		key_bind: {
			mod: ['Shift', 'Alt'],
			keys: ['F']
		}
	});

	commands_to_return.push({
		command: 'create-route',
		title: 'Create route',
		subtitle: 'create a new sveltekit route',
		icon: Route,
		action_component: AddRoute
	});

	commands_to_return.push({
		command: 'svelte-add',
		title: 'Svelte add',
		subtitle: 'quickly add a svelte integration',
		icon: SvelteAddIcon,
		action_component: SvelteAdd
	});

	commands_to_return.push({
		command: 'save',
		title: 'Save',
		subtitle: 'save the current project',
		icon: Save,
		action() {
			if ($page.data.user) {
				if (!$page.data.owner_id || $page.data.user.id === $page.data.owner_id) {
					save_repl();
					return;
				}
				error('You are trying to save a REPL not owned by you. You might want to fork it first.');
				return;
			}
			error('It seems you are trying to save. Login to save your project.');
		},
		key_bind: {
			mod: ['$mod'],
			keys: ['S']
		}
	});

	if ($page.data.id) {
		commands_to_return.push({
			command: 'fork',
			title: 'Fork',
			subtitle: 'fork the current project',
			icon: Fork,
			action() {
				run_callbacks('fork');
			}
		});
	}

	commands_to_return.push({
		command: 'vim-keybindings',
		title: 'Vim Keybindings',
		subtitle: 'toggle vim keybindings',
		icon: Keyboard,
		action: editor_config.toggle_vim
	});

	commands_to_return.push({
		command: 'npm-install',
		title: 'Install package',
		subtitle: 'install a package from npm',
		icon: NPM,
		action_component: NpmInstall
	});

	commands_to_return.push({
		command: 'export-download-zip',
		title: 'Export',
		subtitle: 'download current project as .zip',
		icon: Download,
		action() {
			webcontainer.save_as_zip();
		}
	});

	if ($page.data.user) {
		commands_to_return.push({
			command: 'profile',
			title: 'Profile',
			subtitle: 'browse your saved projects',
			icon: Profile,
			action() {
				goto('/profile');
			}
		});
	}

	commands_to_return.push({
		command: 'new-project',
		title: 'New',
		subtitle: 'create a new blank project',
		icon: New,
		action() {
			goto('/');
		},
		key_bind: {
			mod: ['$mod', 'Shift'],
			keys: ['C']
		}
	});

	commands_to_return.push({
		command: 'new-project-template',
		title: 'Open Template',
		subtitle: 'create a new blank project with a starter template',
		icon: New,
		action_component: StartTemplate
	});

	commands_to_return.push({
		command: 'default-project-template',
		title: 'Default Template',
		subtitle: 'choose the template we will load as the default',
		icon: Bookmark,
		action_component: SaveStartTemplate
	});

	commands_to_return.push({
		command: 'switch-theme',
		title: 'Switch Theme',
		subtitle: 'toggle light or dark theme',
		icon: Themes,
		action() {
			get_theme().change_preference();
		},
		key_bind: {
			mod: ['$mod'],
			keys: ['0']
		}
	});

	commands_to_return.push({
		command: 'toggle-config',
		title: 'Toggle Config Files',
		subtitle: 'toggle wether file tree starts from project root or src folder',
		icon: ConfigFiles,
		action() {
			layout_store.toggle_config();
		}
	});

	commands_to_return.push({
		command: 'toggle-sort',
		title: 'Toggle Folder / File Sort Order',
		subtitle: 'toggle wether files or folders show up first',
		icon: Sorting,
		action() {
			layout_store.toggle_sort();
		}
	});

	if ($page.data.id) {
		commands_to_return.push({
			command: 'share-id',
			title: 'Share via id',
			subtitle: 'copy link that shares current project via id',
			icon: Share,
			action() {
				share_with_id();
			}
		});
	}

	commands_to_return.push({
		command: 'share-hash',
		title: 'Share via Hash',
		subtitle: 'copy link that shares current project via hash',
		icon: Share,
		action() {
			share_with_hash();
		}
	});

	commands_to_return.push({
		command: 'remove-theme-preference',
		title: 'Remove Theme Preference',
		subtitle: 'use OS preference',
		icon: Themes,
		action() {
			get_theme().remove_preference();
		}
	});

	commands_to_return.push({
		command: 'open-sveltelab-github',
		title: 'Open GitHub',
		subtitle: 'open SvelteLab GitHub Repo',
		icon: GitHub,
		action() {
			window.open(`${PUBLIC_GITHUB_REPO}`, '_blank');
		}
	});

	commands_to_return.push({
		command: 'submit-issue',
		title: 'Submit Issue',
		subtitle: 'open new Issue for SvelteLab',
		icon: Issue,
		action() {
			window.open(`${PUBLIC_GITHUB_REPO}/issues/new`, '_blank');
		}
	});

	commands_to_return.push({
		command: 'join-discord',
		title: 'Join Discord',
		subtitle: 'Join our Discord server',
		icon: Discord,
		action() {
			window.open(PUBLIC_DISCORD_INVITE, '_blank');
		}
	});

	commands_to_return.push({
		command: 'credits',
		title: 'Credits',
		subtitle: 'Show Open Source dependency credits',
		icon: Credits,
		action() {
			open_credits();
		}
	});

	commands_to_return.push({
		command: 'show-intro',
		title: 'Show Intro',
		subtitle: 'Show Intro again and remove hidden forever preference',
		icon: Intro,
		action() {
			intro_hidden_forever.set(false);
			is_intro_open.set(true);
		}
	});

	return commands_to_return;
});
