<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import FlyingPaper from './FlyingPaper.svelte';
	import GitHub from '~icons/mdi/github';
	import { get_random_cloning_message } from './cloning_messages';
</script>

<div class="overlay">
	<div class="loading">
		<Logo width="20%" />
		<FlyingPaper />
		<GitHub />
	</div>
	<p>{get_random_cloning_message()}</p>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
		backdrop-filter: blur(10px);
		z-index: 100;
	}
	p {
		align-self: start;
		font-size: 2.5rem;
		margin: 0;
		max-width: 90%;
		text-align: center;
	}
	.loading {
		width: 50vw;
		position: relative;
		height: 30vh;
		align-self: end;
	}
	.loading :global(svg) {
		position: absolute;
		height: 100%;
	}

	.loading :global(svg):is(:first-child, :last-child) {
		width: 20%;
	}
	.loading :global(svg):last-child {
		right: 0;
	}
	@media (max-width: 430px) {
		.loading {
			width: 70vw;
			height: 10vh;
		}
	}
</style>
