import { browser } from '$app/environment';
import { persisted } from 'svelte-local-storage-store';

const default_preferences = {
	ligatures: true,
	editor_size: 1.6,
	editor_family: 'JetBrains Mono',
};

const font_preferences = persisted('sk__font_preferences', default_preferences);

export default font_preferences;

export function set_default_font_preferences() {
	font_preferences.set({ ...default_preferences });
}

export function apply_font_preferences() {
	font_preferences.subscribe(({ ligatures, editor_size, editor_family }) => {
		if (!browser) return;
		document.documentElement.style.setProperty(
			'--sk-font-variant-ligatures',
			ligatures ? 'initial' : 'none'
		);

		document.documentElement.style.setProperty('--sk-editor-font-size', editor_size + 'rem');
		document.documentElement.style.setProperty(
			'--sk-editor-font-family',
			editor_family.trim() || 'JetBrains Mono'
		);
	});
}
