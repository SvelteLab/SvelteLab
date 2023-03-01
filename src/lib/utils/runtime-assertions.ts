import type { DirectoryNode, FileNode } from "@webcontainer/api";

export function is_html_element(node: Node): node is HTMLElement {
	return node instanceof HTMLElement;
}

export function is_dir(file: DirectoryNode | FileNode): file is DirectoryNode {
	return "directory" in file;
}
