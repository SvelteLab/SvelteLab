<script lang="ts">
	export let image_bytes: Uint8Array;
	export let type: string;

	$: data_url = URL.createObjectURL(new Blob([image_bytes], { type: `image/${type}` }));
</script>

<img src={data_url} alt="preview" />

<style>
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		grid-row: 2;
		overflow: auto;
		background-color: var(--sk-back-1);
	}
</style>
