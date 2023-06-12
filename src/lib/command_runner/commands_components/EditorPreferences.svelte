<script lang="ts">
	import editor_preferences, { set_default_editor_preferences } from '$lib/editor_preferences';
	import font_preferences, { set_default_font_preferences } from '$lib/font_preferences';
</script>

<form>
	<h3>Font</h3>
	<div class="grid">
		<label>
			Size
			<input type="range" min="1" max="3.2" step="0.1" bind:value={$font_preferences.editor_size} />
			<span>
				<code>{$font_preferences.editor_size}rem</code>
			</span>
		</label>
		<label>
			Family
			<input
				class="action-field"
				type="text"
				min="1"
				max="3.2"
				step="0.1"
				bind:value={$font_preferences.editor_family}
			/>
			<span>
				<code>foobar</code>
			</span>
		</label>
		<label aria-selected={$font_preferences.ligatures}>
			<span> Use Ligatures </span>
			<input type="checkbox" bind:checked={$font_preferences.ligatures} />
			<span>
				<code> {'=>'} </code>
				<code> !== </code>
				<code> >= </code>
			</span>
		</label>
	</div>

	<button on:click={set_default_font_preferences} type="button" class="action-confirm">
		Restore to defaults
	</button>
	<h3>Editor</h3>
	<div class="grid">
		<label>
			Delay function
			<select bind:value={$editor_preferences.delay_function}>
				<option value="throttle">Throttle</option>
				<option value="debounce">Debounce</option>
			</select>
		</label>
		<label>
			Delay duration
			<input class="action-field" type="number" bind:value={$editor_preferences.delay_duration} />
		</label>
	</div>

	<button on:click={set_default_editor_preferences} type="button" class="action-confirm">
		Restore to defaults
	</button>
</form>

<style>
	form {
		display: grid;
		gap: 2rem;
		margin: 2rem;
	}
	.grid {
		display: grid;
		gap: 2rem;
		grid-template-columns: repeat(3, 1fr);
	}

	@media only screen and (max-width: 770px) {
		.grid {
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
		font-size: var(--sk-editor-font-size);
	}

	input[type='checkbox'] {
		width: 2rem;
		height: 2rem;
	}
</style>
