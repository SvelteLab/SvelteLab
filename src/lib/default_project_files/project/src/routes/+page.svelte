<script lang="ts">
	import Intro from './Intro.svelte';
	import './global.css';
	export let data;
</script>

<h1>Hello {data.name}!</h1>

<hr />

<Intro />
