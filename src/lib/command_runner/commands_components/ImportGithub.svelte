<script lang="ts">
	import { build_import_href, github_regex } from '$lib/github_import_regex';

	export let value = 'https://github.com/';
	$: repo = value.split('github.com/')[1];
	$: info = repo?.match(github_regex)?.groups;
</script>

<form>
	<label>
		Github Repo URL
		<!-- svelte-ignore a11y-autofocus -->
		<input bind:value autofocus type="text" class="action-field" />
	</label>

	{#if info}
		<dl>
			{#each Object.keys(info) as group}
				<dt>{group[0].toUpperCase()}{group.slice(1)}:</dt>
				{#if info[group]}
					<dd>{info[group]}</dd>
				{:else}
					<dd><i>none...</i></dd>
				{/if}
			{/each}
		</dl>
	{:else}
		<p>
			Enter a valid Github Repository URL like <code>https://github.com/SvelteLab/SvelteLab</code>
			or even use a folder path like
			<code
				>https://github.com/SvelteLab/SvelteLab/tree/main/src/lib/default_project_files/tailwind</code
			>
			or you can simply type <code>sveltelab.dev/</code> before <code>github.com/...</code> in your url
			bar while visiting a repository.
		</p>
	{/if}

	<button
		class="action-confirm"
		disabled={!info?.owner || !info?.repo}
		on:click={() => {
			window.location.href = build_import_href(repo);
		}}>Import this Repo!</button
	>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}

	dl {
		display: grid;
		grid-template-columns: min-content auto;
	}

	dl > * {
		margin-block: 0.5rem;
	}

	dt {
		font-weight: 600;
		margin-inline-end: 2rem;
	}

	dd:has(i) {
		color: var(--sk-text-3);
	}
</style>
