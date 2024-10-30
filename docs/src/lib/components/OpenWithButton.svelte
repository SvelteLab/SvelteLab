<script lang="ts">
	import { dev } from '$app/environment';
	import { copy_to_clipboard } from '$lib/util';
	import { toast } from '@zerodevx/svelte-toast';

	const logos = ['dark_short', 'dark_wide', 'light_short', 'light_wide'];
	const base_url = dev ? 'http://localhost:5173/' : 'https://docs.sveltelab.dev/';
	let repo = $state({ username: '', name: '' });

	function convert_url_to_variables(username: string) {
		try {
			const url = new URL(username);
			if (url.host != 'github.com') return;
			const split_path = url.pathname.split('/');
			if (split_path.length <= 2) return;
			repo = {
				username: split_path[1],
				name: split_path[2]
			};
		} catch (error) {
			// input is not a valid url
		}
	}

	function copy_markdown(logo: string) {
		const string = `[![Open in SvelteLab](${base_url}button/${logo}.svg)](https://sveltelab.dev/github.com/${repo.username}/${repo.name})`;

		copy_to_clipboard(string);
		toast.push('Copied Markdown to clipboard!');
	}

	function copy_html(logo: string) {
		const string = `<a href="https://sveltelab.dev/github.com/${repo.username}/${repo.name}">
  <img
    alt="Open in SvelteLab"
    src="${base_url}button/${logo}.svg"
  />
</a>`;

		copy_to_clipboard(string);
		toast.push('Copied HTML to clipboard!');
	}
	$effect(() => {
		if (repo.username) {
			convert_url_to_variables(repo.username);
		}
	});
</script>

<div class="card">
	<p class="title">Github button generator</p>
	<div class="inputgroup">
		<label>
			Username
			<input bind:value={repo.username} type="text" />
		</label>
		<label>
			Repo
			<input bind:value={repo.name} type="text" />
		</label>
	</div>
	<div class="buttongroup">
		{#each logos as logo}
			<div class="buttoncard">
				<img src="/button/{logo}.svg" alt="" />
				<div>
					<button onclick={() => copy_html(logo)}>Copy HTML</button>
					<button onclick={() => copy_markdown(logo)}>Copy Markdown</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.card {
		background-color: var(--sk-back-3);
		color: var(--sk-text-1);
		padding: 2rem;
	}

	.title {
		font-size: 2rem;
	}

	.inputgroup {
		display: flex;
		width: 100%;
		gap: 20px;
	}

	input {
		width: 100%;
		padding: 10px;
	}

	label {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 8px;
	}

	.buttongroup {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 30px;
	}

	.buttoncard {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.buttoncard > div {
		margin-top: auto;
		margin-bottom: auto;
	}

	button {
		background-color: var(--sk-back-4);
		color: var(--sk-text-1);
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 5px;
		padding-bottom: 5px;
		height: min-content;
	}

	button:hover {
		background-color: var(--sk-back-1);
	}
</style>
