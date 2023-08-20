<script lang="ts">
	import { share_with_hash, share_with_id } from '$lib/share';
	import { repl_id } from '$lib/stores/repl_id_store';
	import { tabs } from '$lib/tabs';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
	export let share_way = $repl_id ? 'id' : 'hash';
	let selected_files: string[] = [];
</script>

<form
	on:submit|preventDefault={() => {
		if (share_way === 'id') {
			share_with_id(selected_files);
		} else {
			share_with_hash(selected_files);
		}
		dispatcher('completed');
	}}
	class="wrapper"
	class:mono-column={!$repl_id || $tabs.length === 0}
>
	{#if $repl_id}
		<div class="selector tab">
			<strong>How do you want to share your project?</strong>
			<input type="radio" id="share-id" name="share-way" bind:group={share_way} value="id" />
			<label for="share-id">With id</label>
			<input type="radio" id="share-hash" name="share-way" bind:group={share_way} value="hash" />
			<label for="share-hash">With hash</label>
		</div>
	{/if}
	{#if $tabs.length > 0}
		<div class="tab">
			<strong> What files you want to share? </strong>
			<div class="select-all-none">
				<button
					type="button"
					title="Select all"
					on:click={() => {
						selected_files = $tabs;
					}}>Select all</button
				>
				<button
					type="button"
					title="Select none"
					on:click={() => {
						selected_files = [];
					}}>Select none</button
				>
			</div>
			<div class="checkbox-wrapper">
				{#each $tabs as tab (tab)}
					<input type="checkbox" id="tab-{tab}" bind:group={selected_files} value={tab} />
					<label for="tab-{tab}">{tab}</label>
				{/each}
			</div>
		</div>
	{/if}
	<button>Share</button>
</form>

<style>
	.wrapper {
		padding: 2rem;
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(auto-fit, minmax(35rem, 1fr));
	}
	.mono-column {
		grid-template-columns: 1fr;
	}
	.tab {
		display: grid;
		gap: 1rem;
		align-self: start;
		place-content: start;
		grid-template-columns: 1fr;
	}
	.selector {
		grid-template-columns: min-content 1fr;
	}
	.selector :first-child,
	.select-all-none {
		grid-column: 1/-1;
		display: flex;
		width: 100%;
		gap: 1rem;
	}
	strong {
		font-size: 2rem;
	}
	button {
		flex-basis: 100%;
		background-color: var(--sk-theme-1);
		grid-column: 1/-1;
	}
	.checkbox-wrapper {
		grid-column: 1/-1;
		display: grid;
		grid-template-columns: min-content 1fr;
		max-height: 30rem;
		overflow-y: auto;
		gap: 1rem;
	}
</style>
