import { is_dir } from '$lib/file_system';
import { files } from '$lib/webcontainer';
import { derived } from 'svelte/store';
import { layout_store } from './layout_store';

/**
 *  the base path is ./ if the user set show_config to true or if there's no src directory
 *  otherwise is ./src/
 */
export const base_path = derived([layout_store, files], ([$layout_store, $files]) => {
	return $layout_store.show_config || !($files?.src && is_dir($files.src)) ? './' : './src/';
});
