<script lang="ts">
	import TreeMap from '$lib/components/TreeMap.svelte';
	import type { PageData } from './$types';
	import Share from '~icons/akar-icons/network';
	import TrashCan from '~icons/akar-icons/trash-can';
	import { flip } from 'svelte/animate';

	export let data: PageData;
</script>

<main>
	{#each data.repls as project (project.id)}
		<!-- this will be useful when we will add delete -->
		<a animate:flip href={project.id}>
			<article>
				<p>
					{project.name}
				</p>
				<small>/{project.id}</small>
				<div class="buttons">
					<button>
						<TrashCan />
					</button>
					<button>
						<Share />
					</button>
				</div>
				<div class="tree">
					<TreeMap tree={project.files} />
				</div>
			</article>
		</a>
	{/each}
</main>

<style>
	main {
		padding: 2rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
		gap: 3rem;
		max-width: 100%;
	}
	a {
		color: var(--sk-text-1);
		text-decoration: none;
	}
	article {
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 30%), 0 2px 4px -2px rgb(0 0 0 / 70%);
		padding: 2rem;
		position: relative;
		border-radius: 0.5rem;
		overflow: hidden;
	}
	article > * {
		max-width: 80%;
	}
	.tree {
		right: 0;
		top: 0;
		width: 20%;
		bottom: 0;
		position: absolute;
		border-left: 1px solid var(--sk-code-bg);
		background: linear-gradient(-45deg, var(--sk-code-bg), transparent);
	}
	.tree :global(svg) {
		position: absolute;
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
	.buttons {
		margin-block: 1rem;
		display: flex;
	}
	p {
		margin: 0;
		font-size: 2rem;
	}
	small {
		background: var(--sk-back-2);
		padding: 0.25rem 0.5rem;
		grid-row: -1;
	}
</style>
