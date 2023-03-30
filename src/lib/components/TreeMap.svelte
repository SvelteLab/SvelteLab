<script lang="ts">
	import { is_dir } from '$lib/file_system';
	import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';
	export let tree: FileSystemTree;
	export let file_color = 'var(--sk-text-1)';
	export let folder_color = 'var(--sk-theme-1)';
	let _tree = (tree.src as DirectoryNode)?.directory || tree;
	const padding = 3;

	function flattenDir(dir: FileSystemTree, start_x = padding, start_y = padding / 2) {
		const length = 10;
		const files = Object.keys(dir ?? {}).sort((file_one, file_two) => {
			// if they are both dirs order alphabetically
			if (is_dir(dir[file_one]) && is_dir(dir[file_two])) {
				return file_one.localeCompare(file_two);
			}
			//if file_one is dir put it first
			if (is_dir(dir[file_one])) return -1;
			//if file_two is dir put it first
			if (is_dir(dir[file_two])) return 1;
			//if they are both files order alphabetically
			return file_one.localeCompare(file_two);
		});
		let retval: { x1: number; x2: number; y1: number; y2: number; stroke: string }[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			retval.push({
				x1: start_x,
				x2: start_x + length,
				y1: (start_y + retval.length) * 3,
				y2: (start_y + retval.length) * 3,
				stroke: is_dir(dir[file]) ? folder_color : file_color
			});
			const current_dir = dir[file];
			if (is_dir(current_dir)) {
				const recursive = flattenDir(current_dir.directory, start_x + 2, start_y + retval.length);
				retval.push(...recursive);
			}
		}
		return retval;
	}

	$: files = flattenDir(_tree);
	$: max_y = Math.max(...files.map((file) => file.y1));
	$: max_x = Math.max(...files.map((file) => file.x2));
</script>

<svg viewBox="0 0 {max_x + padding} {Math.max(max_y + padding, 30)}">
	{#each files as file}
		<line {...file} stroke-linecap="round" />
	{/each}
</svg>
