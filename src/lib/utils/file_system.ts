import type { FileSystemTreeExtended } from "$lib/webcontainer/files";
import { is_dir } from "./runtime-assertions";

export function get_file_from_path(base_path: string, files: FileSystemTreeExtended) {
	const path = base_path.split(/\.?\//);
	let subtree: FileSystemTreeExtended = files;
	for (let index = 0; index < path.length; index++) {
		const path_part = path[index];
		if (path_part) {
			const file = subtree[path_part];
			if (is_dir(file)) {
				subtree = file.directory;
			} else {
				return file.file;
			}
		}
	}
	throw new Error("You are trying to get the file content of a folder");
}

export function get_subtree_from_path(base_path: string, files: FileSystemTreeExtended) {
	const path = base_path.split(/\.?\//);
	let subtree: FileSystemTreeExtended = files;
	for (let index = 0; index < path.length; index++) {
		const path_part = path[index];
		if (path_part) {
			const file = subtree[path_part];
			if (is_dir(file)) {
				subtree = file.directory;
			}
		}
	}
	return subtree;
}