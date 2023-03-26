<script context="module">
	import Dialog from '$lib/components/Dialog.svelte';
	import deps from '$lib/dependency-report.json';
	import { writable } from 'svelte/store';
	export function open_credits() {
		show_credits.set(true);
	}
	const show_credits = writable(false);
</script>

<script>
</script>

<Dialog is_open={$show_credits}>
	<h2>
		<img src="/logo.svg" alt="svelteblitz logo" />
		SvelteBlitz Credits
	</h2>
	<p>
		Made with 🧡 by
		<a target="_blank" rel="noreferrer" href="https://github.com/paoloricciuti"> Paolo Ricciuti </a>
		and
		<a target="_blank" rel="noreferrer" href="https://www.sarcevic.dev/"> Antonio Sarcevic </a>
	</p>
	<p>
		View the source code on <a href="https://github.com/svelteblitz/svelteblitz">
			github.com/svelteblitz/svelteblitz
		</a>
	</p>
	<h3 class="headline-5">Made possible thanks to the following open source work</h3>
	<ul>
		{#each deps as dep}
			{@const link = dep.link.replace('git://', 'https://').replace('git+', '')}
			<li>
				<a target="_blank" rel="noreferrer" href={link}>{dep.name}</a>
				<span class="version">@ {dep.installedVersion}</span>
				<span class="license">{dep.licenseType}</span>
			</li>
		{/each}
	</ul>
</Dialog>

<style>
	h2 {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		list-style: none;
		padding: 0;
		overflow: auto;
	}
	li {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
	}
	.license {
		margin-left: auto;
	}
	@media only screen and (min-width: 1000px) {
		li {
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;
		}
	}
	li:nth-child(2n) {
		background-color: var(--sk-back-3);
	}
	li:last-child {
		border-bottom-right-radius: 0.5em;
		border-bottom-left-radius: 0.5em;
	}
	a {
		background-color: transparent;
		padding: 0;
		display: inline;
	}
	.version {
		font-size: 0.75rem;
		color: var(--md-on-surface-variant);
	}
</style>
