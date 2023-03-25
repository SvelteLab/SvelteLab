<script lang="ts">
	import { get_icon } from '$lib/file_icons';
	import { command_runner } from '$lib/stores/command_runner_store';
	import type { Command } from '$lib/types';

	let search = '';
	let dialog: HTMLDialogElement;
	let showed_action_component: null | string = null;
	export let commands = [] as Command[];
	$: mode = search.startsWith('>') ? 'command' : 'file';
	$: filtered_commands = commands.filter((command) => {
		if (mode === 'file') {
			return command.title.toLowerCase().includes(search.toLowerCase()) && !command.command;
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
</script>

<svelte:window
	on:click={click_outside_handler}
	on:keydown={(e) => {
		if (!(e.code === 'KeyE' && e.ctrlKey) || dialog.open) return;
		e.preventDefault();
		open_command_runner();
	}}
	on:keydown={(e) => {
		if (!(e.code === 'KeyP' && e.ctrlKey) || dialog.open) return;
		e.preventDefault();
		search = '> ';
		open_command_runner();
	}}
/>
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
			<input bind:value={search} placeholder="🔍 Search for files, or type `>` for commands..." />
		</form>
	</section>
	<ul>
		{#each filtered_commands as command}
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
						<svelte:component this={get_icon(command.title)} />
					{:else if command.icon}
						<svelte:component this={command.icon} />
					{/if}
					{command.title}
					{#if command.subtitle}
						<small>{command.subtitle}</small>
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
		padding: 1rem;
		margin: auto;
		width: min(80rem, 90%);
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
	}
</style>
