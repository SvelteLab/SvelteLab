<script context="module">
	import Dialog from '$lib/components/Dialog.svelte';
	import { writable } from 'svelte/store';
	export function open_credits() {
		show_credits.set(true);
	}
	const show_credits = writable(false);
</script>

<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import deps_json from '$lib/dependency-report.json';

	type Dependency = {
		department?: string;
		relatedTo?: string;
		name: string;
		licensePeriod?: string;
		material?: string;
		licenseType: string;
		link: string;
		remoteVersion?: string;
		installedVersion: string;
		definedVersion?: string;
		author: string;
	};

	let extra_deps: Dependency[] = [
		{
			name: 'r-icons',
			installedVersion: '0.1.0',
			author: 'Rinconx64',
			link: 'https://github.com/Rinconx64/r-icons',
			licenseType: 'MIT'
		}
	];

	let deps = [...deps_json, ...extra_deps].sort(compareDependencyByName) as Dependency[];

	function compareDependencyByName({ name: a }: Dependency, { name: b }: Dependency) {
		if (a.startsWith('@')) a = a.substring(1);
		if (b.startsWith('@')) b = b.substring(1);

		return a.localeCompare(b);
	}
</script>

<Dialog is_open={$show_credits}>
	<h2>
		<Logo />
		SvelteLab Credits
	</h2>
	<p>
		Made with 🧡 by
		<a target="_blank" rel="noreferrer" href="https://github.com/paoloricciuti"> Paolo Ricciuti </a>
		and
		<a target="_blank" rel="noreferrer" href="https://www.sarcevic.dev/"> Antonio Sarcevic </a>
	</p>
	<p>
		View the source code on <a href="https://github.com/sveltelab/sveltelab">
			github.com/sveltelab/sveltelab
		</a>
	</p>
	<h3 class="headline-5">Made possible thanks to the following open source work</h3>
	<ul>
		{#each deps as dep}
			{@const link = dep.link.replace('git://', 'https://').replace('git+', '').replace('.git', '')}
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
	@media only screen and (min-width: 800px) {
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
		font-size: var(--sk-text-xs);
		color: var(--sk-text-3);
	}
</style>
