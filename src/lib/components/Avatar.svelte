<script lang="ts">
	export let src: string;
	export let alt: string;
	export let size = 24;
</script>

<img {src} {alt} style:--width={size} />

<style>
	img {
		width: calc(var(--size, 24) * 1px);
		aspect-ratio: 1;
		border-radius: 50%;
	}
</style>
