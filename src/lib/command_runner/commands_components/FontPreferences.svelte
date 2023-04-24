<script lang="ts">
	import font_preferences from '$lib/font_preferences';
</script>

<form>
	<label aria-selected={$font_preferences.ligatures}>
		<span>
			<input type="checkbox" bind:checked={$font_preferences.ligatures} />
			Use Ligatures
		</span>
		<span>
			<code> {'=>'} </code>
			<code> !== </code>
			<code> >= </code>
		</span>
	</label>
	<label>
		Editor Font Size
		<input type="range" min="1" max="3.2" step="0.1" bind:value={$font_preferences.editor_size} />
		<span>
			<code>{$font_preferences.editor_size}rem</code>
		</span>
	</label>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
		grid-template-columns: repeat(3, 1fr);
	}

	@media only screen and (max-width: 500px) {
		form {
			grid-template-columns: 1fr;
		}
	}

	label {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		border: 1px solid var(--sk-back-4);
		padding: 2rem;
		border-radius: 0.3em;
	}

	label[aria-selected='true'] {
		border: 1px solid var(--sk-theme-1);
	}

	code {
		font-size: var(--sk-editor-size);
	}

	.editor-size {
		display: grid;
		grid-template-columns: max-content 1fr;
	}
</style>
