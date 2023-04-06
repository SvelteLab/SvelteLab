<script>
	import './global.css';
	import Hello from './Hello.svx';
	import SvelteLabIntro from '$lib/Intro.svelte';
	export let data;
</script>

<Hello title={data.name} />
<hr />

<SvelteLabIntro />
