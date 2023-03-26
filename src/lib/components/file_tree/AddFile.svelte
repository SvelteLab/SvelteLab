<script lang="ts">
	import { get_folder_icon, get_file_icon } from '$lib/file_icons';
	import { createEventDispatcher } from 'svelte';
	import Close from '~icons/material-symbols/close';
	import Check from '~icons/material-symbols/done';

	export let type: 'folder' | 'file';
	let name = '';

	const dispatch = createEventDispatcher();
</script>

<form
	on:submit={(e) => {
		e.preventDefault();
		if (!name) return;
		dispatch('add', name.toString());
	}}
>
	<svelte:component this={type === 'folder' ? get_folder_icon(name) : get_file_icon(name)} />
	<!-- svelte-ignore a11y-autofocus -->
	<input bind:value={name} autofocus />
	<button title="Create file"><Check /></button>
	<button
		title="Cancel"
		type="button"
		on:click={() => {
			dispatch('cancel');
		}}
	>
		<Close />
	</button>
</form>

<style src="./style.css"></style>
