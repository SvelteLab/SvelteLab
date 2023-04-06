<script>
	import './global.css';
	import SvelteLabIntro from '$lib/Intro.svelte';
	export let data;
</script>

<h1 class="text-3xl font-bold text-[#ff3e00]">
	Hello {data.name}!
</h1>
<p>
	This is the <span class="font-bold">Typescript+Tailwind</span> template from
	<span class="font-bold">SvelteLab</span>
</p>

<hr />

<SvelteLabIntro />
