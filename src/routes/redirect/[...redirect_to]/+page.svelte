<script lang="ts">
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

Logged in
