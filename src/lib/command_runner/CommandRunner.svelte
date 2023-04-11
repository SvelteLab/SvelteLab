<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
	import { command_runner } from '$lib/stores/command_runner_store';
	import type { Command } from '$lib/types';
	import { onDestroy, tick } from 'svelte';
	import tinykeys, { parseKeybinding, type KeyBindingMap } from 'tinykeys';
	import { get_key_bind } from './shortcuts-utilities';

	export let commands = [] as Command[];

	let search = '';
	let dialog: HTMLDialogElement;
	let showed_action_component: null | string = null;
	let handle_window_click: ((e: MouseEvent) => void) | undefined = undefined;

	let input_element: HTMLInputElement;
	let command_button_elements: Record<number, HTMLButtonElement> = {};

	let unbind_function: () => void;

	const close_dialog_on_out_click = (e: MouseEvent) => {
		if (dialog === e.target) dialog.close();
	};

	function open_command_runner() {
		dialog.showModal();
		handle_window_click = close_dialog_on_out_click;
	}

	$: key_bind_commands(commands);

	$: mode = search.startsWith('>') ? 'command' : 'file';

	$: filtered_commands = commands.filter((command) => {
		if (mode === 'file') {
			return command.title.toLowerCase().includes(search.trim().toLowerCase()) && !command.command;
		}
		return command.command?.includes(search.substring(1).trim().split(' ')[0]);
	});

	$: current_command = filtered_commands[0] as Command | null;

	$: {
		if ($command_runner) {
			open_command_runner();
		}
	}

	function swap_current_command(where: 1 | -1) {
		const previous_index = filtered_commands.findIndex((command) => command === current_command);
		let next_index = previous_index + where;
		if (previous_index === -1) {
			input_element.focus();
			next_index = 0;
		}

		// wrap around
		if (next_index >= filtered_commands.length) next_index = 0;
		if (next_index <= -1) next_index = filtered_commands.length - 1;

		current_command = filtered_commands[next_index];
		command_button_elements[next_index].scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	async function key_bind_commands(commands: Command[]) {
		if (typeof unbind_function === 'function') {
			unbind_function();
		}
		const key_binds: KeyBindingMap = {};

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

		function open_command_runner_bind(event: KeyboardEvent) {
			event.preventDefault();
			if (!dialog.open) {
				open_command_runner();
				return;
			}
			input_element.focus();
			input_element.setSelectionRange(0, search.length);
		}

		key_binds[
			get_key_bind({
				mod: ['$mod'],
				keys: ['P']
			})
		] = open_command_runner_bind;

		key_binds[
			get_key_bind({
				mod: ['$mod'],
				keys: ['E']
			})
		] = open_command_runner_bind;

		key_binds[
			get_key_bind({
				mod: ['$mod', 'Shift'],
				keys: ['P']
			})
		] = async (event) => {
			event.preventDefault();
			if (!dialog.open) {
				// open command runner in command mode
				search = '> ';
				open_command_runner();
				return;
			}
			if (!search.startsWith('>')) {
				search = '> ' + search;
			}
			await tick();
			input_element.focus();
			input_element.setSelectionRange(1, search.length);
		};

		key_binds[
			get_key_bind({
				keys: ['ArrowDown']
			})
		] = (event) => {
			if (dialog.open) {
				event.preventDefault();
				swap_current_command(1);
			}
		};

		key_binds[
			get_key_bind({
				keys: ['ArrowUp']
			})
		] = (event) => {
			if (dialog.open) {
				event.preventDefault();
				swap_current_command(-1);
			}
		};

		unbind_function = tinykeys(window, key_binds);
	}

	onDestroy(() => {
		if (typeof unbind_function === 'function') {
			unbind_function();
		}
	});
</script>

<svelte:window on:click={handle_window_click} />

<dialog
	bind:this={dialog}
	on:close={() => {
		search = '';
		showed_action_component = null;
		handle_window_click = undefined;
		command_runner.close();
	}}
>
	<section>
		<form
			on:submit|preventDefault={() => {
				if (typeof current_command?.action === 'function') {
					current_command.action();
					dialog.close();
				} else if (current_command?.action_component && current_command.command) {
					showed_action_component = current_command.command;
				}
			}}
		>
			<input
				bind:this={input_element}
				bind:value={search}
				on:blur={() => {
					current_command = null;
				}}
				placeholder="🔍 Search for files, or type `>` for commands..."
			/>
		</form>
	</section>
	<ul class="commands">
		{#each filtered_commands as command, index}
			{@const key_bind = command.key_bind ? parseKeybinding(get_key_bind(command.key_bind)) : null}
			{@const key_bind_sequence = key_bind?.map((bind) => bind.flat(Infinity))}
			{@const current = command === current_command}
			<li>
				<!-- TODO: rework how action components work: replace palette instead of inline -->
				<button
					class:current
					aria-current={current}
					bind:this={command_button_elements[index]}
					class:opened={command.action_component && showed_action_component === command.command}
					on:click={() => {
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
						<ul class="key_binds">
							{#each key_bind_sequence || [] as sequence}
								<li>
									{#each sequence as kbd}
										<kbd>
											{kbd}
										</kbd>
									{/each}
								</li>
							{/each}
						</ul>
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
		--palette-back: var(--sk-back-2);
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
		background-color: var(--palette-back);
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
		margin: 0;
		list-style: none;
	}
	li {
		min-width: 0;
	}
	ul.commands {
		height: 40vh;
		overflow-y: auto;
		background-color: var(--palette-back);
		position: relative;
		border-top: 1px solid var(--sk-back-4);
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		padding: 1rem;
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	ul.key_binds {
		margin-inline-start: auto;
	}

	ul.key_binds > li {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.current {
		background-color: var(--sk-back-4);
	}

	kbd {
		margin-left: auto;
		font-family: var(--sk-font);
		font-weight: 800;
		text-transform: uppercase;
		border: 1px solid var(--sk-back-5);
		color: var(--sk-text-3);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		line-height: 1.5rem;
	}

	section:before {
		content: '';
		position: absolute;
		width: 100%;
		height: 50%;
		background-color: var(--palette-back);
		bottom: 0;
		z-index: -1;
	}
	button {
		background-color: var(--palette-back);
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
	button:hover {
		background-color: var(--sk-back-3);
	}
	.opened {
		background-color: var(--sk-back-4);
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
	@media only screen and (max-width: 500px) {
		ul.commands,
		input {
			border-radius: 0;
		}
		kbd {
			display: none;
		}
	}
</style>
