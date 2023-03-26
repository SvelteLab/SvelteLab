<script lang="ts">
	import './global.css';
	import SvelteBlitzIntro from './Intro.svelte';
	export let data;
</script>

<h1>Hello {data.name}!</h1>

<hr />

<SvelteBlitzIntro />
