<script>
	import README from '../../README.md?raw';
	import { marked } from 'marked';
</script>

<section>
	{@html marked(README.split('---')[0])}
</section>

<style>
	section :global(img) {
		max-width: 100%;
	}
</style>
