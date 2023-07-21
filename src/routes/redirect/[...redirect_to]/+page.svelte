<script lang="ts">
	import LogoLong from '$lib/components/LogoLong.svelte';
	import { onMount } from 'svelte';

	export let data;

	onMount(() => {
		fetch(`http://localhost:${data.port}`, {
			body: JSON.stringify({ code: data.code }),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(() => {
				window.close();
			})
			.catch(() => {
				window.close();
			});
	});
</script>

<main>
	<LogoLong />
	<h1>You've been logged in...if this page doesn't close automatically you can close it.</h1>
</main>

<style>
	:global(body) {
		background-color: var(--sk-back-1);
		display: grid;
		place-items: center;
	}
	main {
		display: grid;
		place-items: center;
		gap: 1rem;
	}
	h1 {
		font-size: 3rem;
	}
</style>
