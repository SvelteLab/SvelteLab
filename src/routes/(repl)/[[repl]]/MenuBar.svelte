<script lang="ts">
	import DropdownMenu from '$lib/components/DropdownMenu.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import { command_runner } from '$lib/stores/command_runner_store';
	import type { Command } from '$lib/types';
	import Cmd from '~icons/material-symbols/keyboard-command-key';
	export let commands = [] as Command[];

	$: commands_per_category = [
		{
			category: 'SvelteLab',
			command: 'command-palette',
			title: 'Open Command Palette',
			icon: Cmd,
			action() {
				command_runner.open('> ');
			},
		} as Command,
		...commands,
	].reduce((acc, current) => {
		if (!(current.category in acc)) acc[current.category] = [];
		acc[current.category].push(current);
		return acc;
	}, {} as Record<string, Command[]>);

	const CATEGORIES: Command['category'][] = ['SvelteLab', 'Project', 'Preferences'];
</script>

<div class="menubar">
	{#each CATEGORIES as category}
		<DropdownMenu>
			<svelte:fragment slot="trigger">{category}</svelte:fragment>
			{#each commands_per_category[category] as command}
				<MenuItem
					on:click={() => {
						if (typeof command.action === 'function') {
							command.action();
						} else if (command.action_component) {
							command_runner.open(command.command);
						}
					}}
				>
					<svelte:component this={command.icon} />
					{command.title}
				</MenuItem>
			{/each}
		</DropdownMenu>
	{/each}
</div>

<style>
	.menubar {
		display: flex;
	}
	.menubar :global(button:hover) {
		background-color: var(--sk-theme-1);
		color: white;
	}
</style>
