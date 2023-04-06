<script>
	import './global.css';
	import SvelteLabIntro from '$lib/Intro.svelte';
	export let data;
</script>

<h1>
	Hello {data.name}!
</h1>
<p>
	This is the <strong>Basic</strong> template from
	<strong>SvelteLab</strong>
</p>

<hr />

<SvelteLabIntro />
