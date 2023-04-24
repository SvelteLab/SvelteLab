<script lang="ts">
	import font_preferences from '$lib/font_preferences';
</script>

<form>
	<label>
		<input type="checkbox" bind:checked={$font_preferences.ligatures} />
		Use Ligatures
		<code>=></code>
		<code>!==</code>
		<code> >= </code>
	</label>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}
</style>
