<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
	import { command_runner } from '$lib/stores/command_runner_store';
	import type { Command } from '$lib/types';
	import { onDestroy } from 'svelte';
	import tinykeys, { parseKeybinding } from 'tinykeys';
	import { get_key_bind } from './shortcuts-utilities';

	let search = '';
	let dialog: HTMLDialogElement;
	let showed_action_component: null | string = null;
	export let commands = [] as Command[];
	$: mode = search.startsWith('>') ? 'command' : 'file';
	$: filtered_commands = commands.filter((command) => {
		if (mode === 'file') {
			return command.title.toLowerCase().includes(search.trim().toLowerCase()) && !command.command;
		}
		return command.command?.includes(search.substring(1).trim().split(' ')[0]);
	});

	const DEFAULT_CLICK_OUTSIDE_HANDLER = (e: MouseEvent) => {
		if (dialog === e.target) {
			dialog.close();
		}
	};

	let click_outside_handler: ((e: MouseEvent) => void) | undefined = undefined;

	function open_command_runner() {
		dialog.showModal();
		click_outside_handler = DEFAULT_CLICK_OUTSIDE_HANDLER;
	}

	$: {
		if ($command_runner) {
			open_command_runner();
		}
	}

	let search_element: HTMLInputElement;

	function swap_focus(where: 1 | -1) {
		const focusable =
			'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
		const elements = [...document.querySelectorAll(focusable)];
		const active_index = elements.findIndex(
			(focusable_element) => focusable_element === document.activeElement
		);
		if (active_index !== -1) {
			let next_element = elements[active_index + where];
			if (!dialog.contains(next_element)) {
				next_element = search_element;
			}
			if (next_element instanceof HTMLElement) {
				next_element.focus();
			}
		}
	}

	let unbind_function: () => void;

	async function key_bind_commands(commands: Command[]) {
		if (typeof unbind_function === 'function') {
			unbind_function();
		}
		const key_binds: Record<string, (event: KeyboardEvent) => void> = {};
		for (let command of commands) {
			if (command.key_bind) {
				key_binds[get_key_bind(command.key_bind)] = (event) => {
					if (typeof command.action === 'function') {
						event.preventDefault();
						event.stopImmediatePropagation();
						event.stopPropagation();
						command.action();
					}
				};
			}
		}

		// OPEN COMMAND RUNNER
		function open_command_runner_bind(event: KeyboardEvent) {
			if (!dialog.open) {
				event.preventDefault();
				open_command_runner();
			}
		}

		key_binds[
			get_key_bind({
				mod: ['$mod'],
				keys: ['P']
			})
		] = open_command_runner_bind;

		// OPEN COMMAND RUNNER
		key_binds[
			get_key_bind({
				mod: ['$mod'],
				keys: ['E']
			})
		] = open_command_runner_bind;

		// OPEN COMMAND RUNNER IN COMMAND MODE
		key_binds[
			get_key_bind({
				mod: ['$mod', 'Shift'],
				keys: ['P']
			})
		] = (event) => {
			if (!dialog.open) {
				event.preventDefault();
				search = '> ';
				open_command_runner();
			}
		};

		key_binds[
			get_key_bind({
				keys: ['ArrowDown']
			})
		] = (event) => {
			if (dialog.open) {
				event.preventDefault();
				swap_focus(1);
			}
		};

		key_binds[
			get_key_bind({
				keys: ['ArrowUp']
			})
		] = (event) => {
			if (dialog.open) {
				event.preventDefault();
				swap_focus(-1);
			}
		};

		unbind_function = tinykeys(window, key_binds);
	}

	$: key_bind_commands(commands);

	onDestroy(() => {
		if (typeof unbind_function === 'function') {
			unbind_function();
		}
	});
</script>

<svelte:window on:click={click_outside_handler} />
<dialog
	bind:this={dialog}
	on:close={() => {
		search = '';
		showed_action_component = null;
		click_outside_handler = undefined;
		command_runner.close();
	}}
>
	<section>
		<form
			on:submit|preventDefault={() => {
				if (filtered_commands.length === 1) {
					const command = filtered_commands[0];
					if (typeof command.action === 'function') {
						command.action();
						dialog.close();
					} else if (command.action_component && command.command) {
						showed_action_component = command.command;
					}
				}
			}}
		>
			<input
				bind:this={search_element}
				bind:value={search}
				placeholder="🔍 Search for files, or type `>` for commands..."
			/>
		</form>
	</section>
	<ul>
		{#each filtered_commands as command}
			{@const key_bind = command.key_bind ? parseKeybinding(get_key_bind(command.key_bind)) : null}
			{@const key_bind_sequence = key_bind
				?.map((bind) => {
					return bind.flat(Infinity).join('+');
				})
				.join(' ')}
			<li>
				<button
					class:opened={command.action_component && showed_action_component === command.command}
					on:click={() => {
						const args = search.split(' ').slice(1);
						if (typeof command.action === 'function') {
							command.action();
							dialog.close();
						} else if (command.action_component && command.command) {
							showed_action_component = command.command;
						}
					}}
					title="Launch command {command.title}"
				>
					{#if mode === 'file'}
						<svelte:component this={get_file_icon(command.title)} />
					{:else if command.icon}
						<svelte:component this={command.icon} style="color: var(--sk-text-1)" />
					{/if}
					{command.title}
					{#if command.subtitle}
						<small>{command.subtitle}</small>
					{/if}
					{#if key_bind_sequence}
						<kbd>
							{key_bind_sequence}
						</kbd>
					{/if}
				</button>
				{#if command.action_component && showed_action_component === command.command}
					<section class="action-component">
						<svelte:component
							this={command.action_component}
							on:completed={() => {
								dialog.close();
							}}
						/>
					</section>
				{/if}
			</li>
		{/each}
	</ul>
</dialog>

<style>
	dialog {
		border: 0;
		padding: 1px;
		margin: auto;
		max-width: 80rem;
		width: 100%;
		background-color: transparent;
		color: var(--sk-text-1);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.05));
		--result-bg: var(--sk-back-3);
	}
	dialog::backdrop {
		background-color: hsla(0, 0%, 0%, 0.2);
		backdrop-filter: blur(2px);
	}
	section {
		position: relative;
	}
	input {
		width: 100%;
		border: 0;
		padding: 1.5rem 2.5rem;
		font-size: 2rem;
		background-color: var(--sk-back-3);
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
		color: inherit;
	}
	input:focus-visible {
		outline-style: solid;
		position: relative;
		z-index: 10;
	}
	ul {
		height: 40vh;
		overflow-y: auto;
		background-color: var(--result-bg);
		margin: 0;
		position: relative;
		border-top: 1px solid var(--sk-back-4);
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		padding: 1rem;
		display: grid;
		align-content: start;
		gap: 1rem;
		list-style: none;
	}
	li {
		min-width: 0;
	}
	section:before {
		content: '';
		position: absolute;
		width: 100%;
		height: 50%;
		background-color: var(--result-bg);
		bottom: 0;
		z-index: -1;
	}
	button {
		background-color: var(--sk-back-3);
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		width: 100%;
		text-align: left;
		z-index: 10;
		position: relative;
	}
	button:hover,
	button:focus {
		background-color: var(--sk-back-4);
	}
	.opened {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}
	small {
		opacity: 0.5;
	}
	.action-component {
		background-color: var(--sk-back-4);
		padding: 1rem;
		width: 100%;
	}
	kbd {
		margin-left: auto;
		background-color: var(--sk-back-5);
		padding: 0.25rem 1rem;
		line-height: 1.5rem;
	}
	@media only screen and (max-width: 500px) {
		ul,
		input {
			border-radius: 0;
		}
		kbd {
			display: none;
		}
	}
</style>
