import { writable } from 'svelte/store';

const font_preferences = writable({
	ligatures: true,
});

export default font_preferences;
