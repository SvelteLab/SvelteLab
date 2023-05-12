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
import { toast } from '@zerodevx/svelte-toast';
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
import FileBrowser from '~icons/material-symbols/menu-rounded';
import Themes from '~icons/material-symbols/routine';
import Save from '~icons/material-symbols/save';
import Share from '~icons/material-symbols/share';
import Bookmark from '~icons/material-symbols/star-outline';
import Terminal from '~icons/material-symbols/terminal-rounded';
import Intro from '~icons/material-symbols/waving-hand-rounded';
import Discord from '~icons/mdi/discord';
import GitHub from '~icons/mdi/github';
import Credits from '~icons/mdi/license';
import Font from '~icons/material-symbols/font-download-outline-rounded';
import SvelteAddIcon from '~icons/sveltelab/svelte-add';
import SearchDocsIcon from '~icons/sveltelab/svelte-lib';
import CreateRoute from './commands_components/CreateRoute.svelte';
import FontPreferences from './commands_components/FontPreferences.svelte';
import InstallPackage from './commands_components/InstallPackage.svelte';
import NewWithTemplate from './commands_components/NewWithTemplate.svelte';
import SearchDocs from './commands_components/SearchDocs.svelte';
import SetDefaultTemplate from './commands_components/SetDefaultTemplate.svelte';
import SvelteAdd from './commands_components/SvelteAdd.svelte';
import WrapText from '~icons/material-symbols/wrap-text-rounded'
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
	const progress_toast = toast.push(`Formatting ${$current_tab}...`, {
		initial: 0,
		dismissable: false,
	});
	const process = await webcontainer.spawn(`prettier`, ['--write', $current_tab]);
	const code = await process.exit;
	toast.pop(progress_toast);
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
		},
	}));

	commands_to_return.push({
		command: 'format-current',
		title: 'Format',
		subtitle: 'format current file with prettier',
		icon: Format,
		action: prettier_action,
		key_bind: {
			mod: ['Shift', 'Alt'],
			keys: ['KeyF'],
		},
	});

	commands_to_return.push({
		command: 'create-route',
		title: 'Create Route',
		subtitle: 'create a new sveltekit route',
		icon: Route,
		action_component: CreateRoute,
		key_bind: {
			mod: ['$mod', 'Alt'],
			keys: ['KeyR'],
		},
	});

	commands_to_return.push({
		command: 'search-docs',
		title: 'Search Docs',
		subtitle: 'search SvelteKit documentation',
		icon: SearchDocsIcon,
		action_component: SearchDocs,
		key_bind: {
			mod: ['$mod', 'Alt'],
			keys: ['KeyK'],
		},
	});

	commands_to_return.push({
		command: 'svelte-add',
		title: 'Svelte Add',
		subtitle: 'quickly add a svelte integration',
		icon: SvelteAddIcon,
		action_component: SvelteAdd,
	});

	commands_to_return.push({
		command: 'save',
		title: 'Save',
		subtitle: 'save the current project',
		icon: Save,
		async action() {
			if ($page.data.user) {
				if (!$page.data.owner_id || $page.data.user.id === $page.data.owner_id) {
					const progress_toast = toast.push(`Saving...`, {
						initial: 0,
						dismissable: false,
					});
					await save_repl();
					toast.pop(progress_toast);
					return;
				}
				error('You are trying to save a REPL not owned by you. You might want to fork it first.');
				return;
			}
			error('It seems you are trying to save. Login to save your project.');
		},
		key_bind: {
			mod: ['$mod'],
			keys: ['KeyS'],
		},
	});

	if ($page.data.id) {
		commands_to_return.push({
			command: 'fork',
			title: 'Fork',
			subtitle: 'fork the current project',
			icon: Fork,
			action() {
				run_callbacks('fork');
			},
		});
	}

	commands_to_return.push({
		command: 'vim-keybindings',
		title: 'Vim Keybindings',
		subtitle: 'toggle vim keybindings',
		icon: Keyboard,
		action: editor_config.toggle_vim,
	});

	commands_to_return.push({
		command: 'line-wrap-code-editor',
		title: 'Wrap Code',
		subtitle: 'toggle line wrap for code editor',
		icon: Keyboard,
		action: editor_config.toggle_code_wrap,
	});

	commands_to_return.push({
		command: 'npm-install-package',
		title: 'Install Package',
		subtitle: 'install a package from npm',
		icon: NPM,
		action_component: InstallPackage,
	});

	commands_to_return.push({
		command: 'export-download-zip',
		title: 'Export',
		subtitle: 'download current project as .zip',
		icon: Download,
		async action() {
			const progress_toast = toast.push(`Zipping up the filesystem...`, {
				initial: 0,
				dismissable: false,
			});
			await webcontainer.save_as_zip();
			toast.pop(progress_toast);
		},
	});

	if ($page.data.user) {
		commands_to_return.push({
			command: 'profile',
			title: 'Profile',
			subtitle: 'browse your saved projects',
			icon: Profile,
			action() {
				goto('/profile');
			},
		});
	}

	commands_to_return.push({
		command: 'new-project',
		title: 'New Project',
		subtitle: 'create a new blank project',
		icon: New,
		action() {
			goto('/');
		},
		key_bind: {
			mod: ['$mod', 'Shift'],
			keys: ['KeyC'],
		},
	});

	commands_to_return.push({
		command: 'new-project-template',
		title: 'New with Template',
		subtitle: 'create new project with a starter template',
		icon: New,
		action_component: NewWithTemplate,
	});

	commands_to_return.push({
		command: 'default-project-template',
		title: 'Set Default Template',
		subtitle: 'choose the template that will load as the default',
		icon: Bookmark,
		action_component: SetDefaultTemplate,
	});

	commands_to_return.push({
		command: 'switch-theme',
		title: 'Switch Theme',
		subtitle: 'toggle light or dark theme',
		icon: Themes,
		action() {
			get_theme().change_preference();
		},
	});

	commands_to_return.push({
		command: 'toggle-file-tree',
		title: 'Toggle File Tree',
		subtitle: 'toggle if file tree is shown',
		icon: FileBrowser,
		action() {
			layout_store.toggle_file_tree();
		},
	});

	commands_to_return.push({
		command: 'toggle-config',
		title: 'Toggle Config Files',
		subtitle: 'toggle if file tree starts from project root or src folder',
		icon: ConfigFiles,
		action() {
			layout_store.toggle_config();
		},
	});

	commands_to_return.push({
		command: 'toggle-sort',
		title: 'Toggle Folder / File Sort Order',
		subtitle: 'toggle if files or folders show up first',
		icon: Sorting,
		action() {
			layout_store.toggle_sort();
		},
	});

	commands_to_return.push({
		command: 'toggle-terminal',
		title: 'Toggle Terminal',
		subtitle: 'toggle if terminal is shown',
		icon: Terminal,
		action() {
			layout_store.toggle_terminal();
		},
	});

	if ($page.data.id) {
		commands_to_return.push({
			command: 'share-id',
			title: 'Share Project',
			subtitle:
				'copy link that shares current project via id, this keeps in sync when you update your project',
			icon: Share,
			async action() {
				const progress_toast = toast.push(`Sharing...`, {
					initial: 0,
					dismissable: false,
				});
				await share_with_id();
				toast.pop(progress_toast);
			},
		});
	}

	commands_to_return.push({
		command: 'share-hash',
		title: 'Share Code Snapshot',
		subtitle: 'copy link that shares current files via hash',
		icon: Share,
		async action() {
			const progress_toast = toast.push(`Sharing...`, {
				initial: 0,
				dismissable: false,
			});
			await share_with_hash();
			toast.pop(progress_toast);
		},
	});

	commands_to_return.push({
		command: 'remove-theme-preference',
		title: 'Remove Theme Preference',
		subtitle: 'use OS preference',
		icon: Themes,
		action() {
			get_theme().remove_preference();
		},
	});

	commands_to_return.push({
		command: 'font-preferences',
		title: 'Font Preference',
		subtitle: 'set font preference',
		action_component: FontPreferences,
		icon: Font,
	});

	commands_to_return.push({
		command: 'open-sveltelab-github',
		title: 'Open GitHub',
		subtitle: 'open SvelteLab GitHub Repo',
		icon: GitHub,
		action() {
			window.open(`${PUBLIC_GITHUB_REPO}`, '_blank');
		},
	});

	commands_to_return.push({
		command: 'submit-issue',
		title: 'Submit Issue',
		subtitle: 'open new Issue for SvelteLab',
		icon: Issue,
		action() {
			window.open(`${PUBLIC_GITHUB_REPO}/issues/new/choose`, '_blank');
		},
	});

	commands_to_return.push({
		command: 'join-discord',
		title: 'Join Discord',
		subtitle: 'Join our Discord server',
		icon: Discord,
		action() {
			window.open(PUBLIC_DISCORD_INVITE, '_blank');
		},
	});

	commands_to_return.push({
		command: 'credits',
		title: 'Credits',
		subtitle: 'Show Open Source dependency credits',
		icon: Credits,
		action() {
			open_credits();
		},
	});

	commands_to_return.push({
		command: 'show-intro',
		title: 'Show Intro',
		subtitle: 'Show Intro again and remove hidden forever preference',
		icon: Intro,
		action() {
			intro_hidden_forever.set(false);
			is_intro_open.set(true);
		},
	});

	return commands_to_return;
});
