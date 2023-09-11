<script lang="ts">
	import { dev } from '$app/environment';
	import { copyToClipboard } from '$lib/util';

	const logos = ['dark_short', 'dark_wide', 'light_short', 'light_wide'];
	const base_url = dev ? 'http://localhost:5173/' : 'https://docs.sveltelab.dev/';
	let repo = { username: '', name: '' };

	$: {
		if (repo.username) {
			convertURLToVariables(repo.username);
		}
	}

	function convertURLToVariables(username: string) {
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

	function copyMarkdown(logo: string) {
		const string = `[![Open in SvelteLab](${base_url}button/${logo}.svg)](https://sveltelab.dev/github.com/${repo.username}/${repo.name})`;

		copyToClipboard(string);
		alert('copied');
	}

	function copyHTML(logo: string) {
		const string = `<a href="https://sveltelab.dev/github.com/${repo.username}/${repo.name}">
  <img
    alt="Open in SvelteLab"
    src="${base_url}button/${logo}.svg"
  />
</a>`;

		copyToClipboard(string);
		alert('copied');
	}
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
					<button on:click={() => copyHTML(logo)}>Copy HTML</button>
					<button on:click={() => copyMarkdown(logo)}>Copy Markdown</button>
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
		background-color: var(--sk-back-5);
		color: #fff;
		padding-left: 10px;
		padding-right: 10px;
		padding-top: 5px;
		padding-bottom: 5px;
		height: min-content;
	}
</style>
