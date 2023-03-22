<script lang="ts">
	import type { Command } from '$lib/types';
	import { onMount } from 'svelte';

	let search = '';
	let mode: 'command' | 'file' = 'file';
	let dialog: HTMLDialogElement;
	export let commands = [] as Command[];
	$: filtered_commands = commands.filter((command) => {
		if (mode === 'file') {
			return command.title.toLowerCase().includes(search.toLowerCase()) && !command.command;
		}
		return command.command?.includes(search.split(' ')[0]);
	});

	onMount(() => {
		dialog.addEventListener('close', () => {
			search = '';
		});
	});
</script>

<svelte:window
	on:keydown={(e) => {
		if (!(e.code === 'KeyE' && e.ctrlKey)) return;
		e.preventDefault();
		dialog.showModal();
		mode = 'file';
	}}
	on:keydown={(e) => {
		if (!(e.code === 'KeyP' && e.ctrlKey)) return;
		e.preventDefault();
		dialog.showModal();
		mode = 'command';
	}}
/>
<dialog bind:this={dialog}>
	<section>
		<form
			on:submit|preventDefault={() => {
				if (filtered_commands.length === 1) {
					const command = filtered_commands[0];
					const args = search.split(' ').slice(1);
					if (typeof command.action === 'function') command.action(...args);
					dialog.close();
				}
			}}
		>
			<input bind:value={search} placeholder="🔍 search for a command... [Esc to quit]" />
		</form>
	</section>
	<ul>
		{#each filtered_commands as command}
			<li>
				<button
					on:click={() => {
						const args = search.split(' ').slice(1);
						if (typeof command.action === 'function') command.action(...args);
						dialog.close();
					}}
					title="Launch command {command.title}"
				>
					{#if mode === 'file'}
						{command.title}
					{:else}
						> {command.command}
					{/if}
					{#if command.subtitle}
						- <small>{command.subtitle}</small>
					{/if}
				</button>
			</li>
		{/each}
	</ul>
</dialog>

<style>
	dialog {
		border: 0;
		padding: 1rem;
		margin: auto;
		min-width: 50vw;
		background-color: transparent;
		color: var(--sk-text-1);
		filter: drop-shadow(0 4px 8px rgb(0 0 0 / 30%)) drop-shadow(0 2px 8px rgb(0 0 0 / 30%));
		--result-bg: var(--sk-back-3);
	}
	dialog::backdrop {
		background-color: transparent;
		backdrop-filter: blur(2px);
	}
	section {
		position: relative;
	}
	input {
		width: 100%;
		border: 0;
		padding: 1rem 2.5rem;
		font-size: 2rem;
		background-color: var(--sk-back-4);
		border-radius: 100vmax;
		color: inherit;
		outline-color: white;
	}
	input:focus-visible {
		position: relative;
		z-index: 10;
	}
	ul {
		height: 30vh;
		overflow-y: auto;
		background-color: var(--result-bg);
		margin: 0;
		position: relative;
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
		padding: 1rem;
		display: grid;
		align-content: start;
		gap: 0.5rem;
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
		background-color: var(--sk-back-5);
		padding: 0.5rem;
		border-radius: 0.5rem;
		width: 100%;
		text-align: left;
	}
	small {
		opacity: 0.5;
	}
</style>
