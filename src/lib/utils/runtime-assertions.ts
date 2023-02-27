import type { DirectoryNodeExtended, FileNodeExtended } from "$lib/webcontainer/files";

export function is_html_element(node: Node): node is HTMLElement {
	return node instanceof HTMLElement;
}

export function is_dir(file: DirectoryNodeExtended | FileNodeExtended): file is DirectoryNodeExtended {
	return "directory" in file;
}
