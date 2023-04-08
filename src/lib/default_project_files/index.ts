import type { DirectoryNode, FileSystemTree } from '@webcontainer/api';

const project = import.meta.glob('./**/!(package-lock.json)', {
	as: 'raw',
	eager: true
});

const project_files: FileSystemTree = {};

for (const file in project) {
	const path = file.split('/').slice(1);
	let subtree = project_files;
	for (let i = 0; i < path.length; i++) {
		// this is to avoid vite complaining when importing the project if
		// it's a valid tsconfig
		const part = path[i].replace('txtjson', 'json');
		const is_directory = i !== path.length - 1;
		if (is_directory) {
			if (!subtree[part]) {
				subtree[part] = {
					directory: {}
				};
			}
			subtree = (subtree[part] as DirectoryNode).directory;
		} else {
			subtree[part] = {
				file: {
					contents: project[file]
				}
			};
		}
	}
}

export const templates = Object.keys(project_files);

export const default_project_files = project_files satisfies FileSystemTree;
