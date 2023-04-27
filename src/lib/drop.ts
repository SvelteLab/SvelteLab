const SIZE_LIMIT = 1024 * 1024; //1MB;

export async function handle_files(files: (File | null)[], options: DropOptions) {
	for (const file of files) {
		if (file) {
			if (file.size > SIZE_LIMIT) {
				if (typeof options.error === 'function') {
					options.error('The size limit for assets is 1mb');
				}
				return;
			}
			try {
				const file_content = await read_file(file);
				if (typeof options.success === 'function') {
					options.success(file.name, file_content);
				}
			} catch (e) {
				if (typeof options.error === 'function') {
					options.error("Can't upload this asset");
				}
			}
		}
	}
}

async function read_file(file: File) {
	const fr = new FileReader();
	let resolve: (value: ArrayBuffer) => void;
	let reject: (reason?: unknown) => void;
	const promise = new Promise<ArrayBuffer>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	fr.addEventListener('load', (e) => {
		const { result } = e.target ?? {};
		if (result instanceof ArrayBuffer) {
			return resolve(result);
		}
		reject();
	});
	fr.addEventListener('error', (e) => {
		reject(e);
	});
	fr.readAsArrayBuffer(file);
	return promise;
}

type DropOptions = {
	success: (file_name: string, file_content: ArrayBuffer) => void;
	error?: (message?: string) => void;
};

export function drop(node: HTMLElement, options: DropOptions) {
	let stored_options = options;
	let class_remove_timeout: ReturnType<typeof setTimeout>;
	function prevent_dragover(e: Event) {
		e.preventDefault();
		e.stopPropagation();
		node.classList.add('drag-target');
		clearTimeout(class_remove_timeout);
	}
	node.addEventListener('dragover', prevent_dragover);
	function on_dragleave() {
		class_remove_timeout = setTimeout(() => {
			node.classList.remove('drag-target');
		}, 100);
	}
	node.addEventListener('dragleave', on_dragleave);
	async function drop_listener(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		node.classList.remove('drag-target');
		const files =
			(e.dataTransfer?.items
				? [...e.dataTransfer.items].map((file) => file.getAsFile())
				: [...(e.dataTransfer?.files ?? [])]) ?? [];
		handle_files(files, stored_options);
	}
	node.addEventListener('drop', drop_listener);
	return {
		destroy() {
			node.removeEventListener('dragover', prevent_dragover);
			node.removeEventListener('drop', drop_listener);
			node.removeEventListener('dragleave', on_dragleave);
		},
		update(new_options: DropOptions) {
			stored_options = new_options;
		},
	};
}
