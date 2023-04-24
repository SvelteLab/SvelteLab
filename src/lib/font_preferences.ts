import { browser } from '$app/environment';
import { persisted } from 'svelte-local-storage-store';

const font_preferences = persisted('sk__font_preferences', {
	ligatures: true,
	editor_size: 1.6,
});

export default font_preferences;

export function apply_font_preferences() {
	font_preferences.subscribe(({ ligatures, editor_size }) => {
		if (!browser) return;
		document.documentElement.style.setProperty(
			'--sk-font-variant-ligatures',
			ligatures ? 'initial' : 'none'
		);

		document.documentElement.style.setProperty('--sk-editor-size', editor_size + 'rem');
	});
}
