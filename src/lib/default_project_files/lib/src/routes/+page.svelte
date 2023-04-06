<script>
	import './global.css';
	import SvelteLabIntro from '$lib/Intro.svelte';
	export let data;
</script>

<h1>Hello {data.name}!</h1>
<p>
	This is the <strong>library</strong> template from <strong>SvelteLab</strong>. Head over to the
	lib folder to start crafting!
</p>

<hr />

<SvelteLabIntro />
