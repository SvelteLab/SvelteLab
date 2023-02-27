import type { DirectoryNodeWithOpen, FileNodeWithOpen, FileSystemTreeWithOpens } from "$lib/webcontainer/files";

export function is_dir(file: DirectoryNodeWithOpen | FileNodeWithOpen): file is DirectoryNodeWithOpen {
	return "directory" in file;
}

export function get_file_from_path(base_path: string, files: FileSystemTreeWithOpens) {
	const path = base_path.split(/\.?\//);
	let subtree: FileSystemTreeWithOpens = files;
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

export function get_subtree_from_path(base_path: string, files: FileSystemTreeWithOpens) {
	const path = base_path.split(/\.?\//);
	let subtree: FileSystemTreeWithOpens = files;
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