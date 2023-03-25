<script>
	import { html } from '../../README.md';
	const intro = html.split('<hr>')[0];
</script>

<section>
	{@html intro}
</section>

<style>
	section :global(img) {
		max-width: 100%;
	}
</style>