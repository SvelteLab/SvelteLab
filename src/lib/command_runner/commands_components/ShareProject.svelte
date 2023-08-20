<script lang="ts">
	import { get_file_icon } from '$lib/file_icons';
	import { ICON } from '$lib/icons';
	import { share_with_hash, share_with_id } from '$lib/share';
	import { repl_id } from '$lib/stores/repl_id_store';
	import { current_tab, tabs } from '$lib/tabs';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();
	let selected_files: string[] = [$current_tab];
</script>

<section>
	<div class="share-buttons">
		<button
			on:click={() => {
				share_with_hash(selected_files);
				dispatcher('completed');
			}}
			class="action-confirm"
		>
			<h3>
				<ICON.Hash />
				<span>
					Share <strong>Code</strong> via Hash
				</span>
			</h3>
			<p>Link will <strong>not keep in sync</strong><br /> when you update your project</p>
		</button>
		{#if $repl_id}
			<button
				on:click={() => {
					share_with_id(selected_files);
					dispatcher('completed');
				}}
				class="action-confirm"
			>
				<h3>
					<ICON.Cloud />
					<span>
						Share <strong>Project</strong> via ID
					</span>
				</h3>
				<p>
					Link will <strong> keep in sync </strong><br />
					when you update your project
				</p>
			</button>
		{/if}
	</div>
	{#if $tabs.length > 0}
		<div class="tab">
			<div class="select-all-none">
				<span>Select which Tabs to share:</span>
				<button
					class="action-confirm"
					title="Select all"
					on:click={() => {
						selected_files = $tabs;
					}}
				>
					<ICON.CheckAll />
					Select all
				</button>
				<button
					class="action-confirm"
					title="Select none"
					on:click={() => {
						selected_files = [];
					}}
				>
					<ICON.CheckBoxBlank />
					Select none
				</button>
			</div>
			<div class="checkbox-wrapper">
				{#each $tabs as tab (tab)}
					{@const icon = get_file_icon(tab)}
					{@const file = tab.split('/').pop()}
					{@const route = tab.split('/').slice(1).join('/')}
					<label>
						<input type="checkbox" bind:group={selected_files} value={tab} />
						<svelte:component this={icon} />
						<span>
							{route}/<strong>{file}</strong>
						</span>
					</label>
				{/each}
			</div>
		</div>
	{:else}
		<div class="no-tabs">
			<p>💡 You can open some Tabs to share them as well!</p>
		</div>
	{/if}
</section>

<style>
	section {
		margin: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.select-all-none {
		display: flex;
		gap: 2rem;
		margin-block-end: 2rem;

		& span {
			flex-grow: 1;
		}

		& button {
			width: auto;
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}

	.no-tabs p {
		text-align: center;
		color: var(--sk-text-3);
		font-style: italic;
	}

	.checkbox-wrapper {
		max-width: fit-content;
		margin: auto;
	}

	.tab {
		padding: 1rem;
		border: 1px solid var(--sk-back-translucent);
		border-radius: 0.5rem;
	}

	.checkbox-wrapper label {
		max-width: fit-content;
		display: flex;
		padding: 1rem;
		align-items: center;
		gap: 1rem;
	}

	.share-buttons {
		display: flex;
		gap: 1rem;
	}

	.share-buttons button {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		& svg {
			font-size: 2rem;
		}
		& h3 {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
		& p {
			margin: 0;
			line-height: 1;
		}
	}
</style>
