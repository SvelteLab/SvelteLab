<script lang="ts">
	import { github_regex } from '$lib/github_import_regex';

	let value = '';
	$: info = value.match(github_regex)?.groups || {};
</script>

<form>
	<label>
		Github URL
		<input
			bind:value
			type="text"
			class="action-field"
			aria-describedby="github-url-hint"
			placeholder="https://github.com/SvelteLab/SvelteLab/tree/main/src/lib/default_project_files/tailwind"
		/>
		<span id="github-url-hint"> You can also use a github folder path! </span>
	</label>

	<dl>
		{#each Object.keys(info) as group}
			<!-- content here -->
			<dt>{group}</dt>
			<dd>{info[group]}</dd>
		{/each}
	</dl>

	<button class="action-confirm">Import this repo!</button>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}
</style>
