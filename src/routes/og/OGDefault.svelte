<script lang="ts">
	import LogoLong from '$lib/components/LogoLong.svelte';
	export let img: string;
</script>

<div class="wrapper">
	<div class="details">
		<header>
			<LogoLong />
			{#if img}
				<img src={img} alt="avatar" />
			{/if}
		</header>
		<h1>The #1 REPL for SvelteKit projects!</h1>
		<p>
			{'Head on https://sveltelab.dev, the supercharged SvelteKit REPL made with svelte, for svelte by svelte lovers and start hacking around with SvelteKit at the speed of light.'}
		</p>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #1a1a1a;
		color: white;
	}
	.details {
		display: flex;
		width: 75%;
		flex-direction: column;
		padding: 50px;
		align-items: flex-start;
		flex-grow: 1;
		gap: 10px;
	}
	.details :global(svg) {
		width: 750px;
		height: 161.8px;
	}
	header {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	img {
		width: 97.09px;
		height: 97.09px;
		border-radius: 50%;
	}
	h1 {
		font-size: 40px;
	}
	p {
		font-size: 35px;
	}
</style>
