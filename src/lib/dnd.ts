export function draggable(node: HTMLElement, data: string) {
	let state = data;
	node.draggable = true;
	node.style.cursor = 'grab';

	function handle_dragstart(e: DragEvent) {
		if (!e.dataTransfer) return;
		e.dataTransfer.setData('text/plain', state);
	}

	node.addEventListener('dragstart', handle_dragstart);

	return {
		update(data: string) {
			state = data;
		},
		destroy() {
			node.removeEventListener('dragstart', handle_dragstart);
		}
	};
}

type DropEffect = 'link' | 'copy' | 'move';

type DropzoneOptions = {
	on_dropzone: (data: string, e: DragEvent) => unknown;
	dropEffect?: 'link' | 'copy' | 'move';
	dragover_class?: string;
};

export function dropzone(node: HTMLElement, options: DropzoneOptions) {
	let state = {
		dropEffect: 'move' as DropEffect,
		dragover_class: 'droppable',
		...options
	};

	function handle_drop(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		const data = e.dataTransfer.getData('text/plain');
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class);
		state.on_dropzone(data, e);
	}

	function handle_dragover(e: DragEvent) {
		e.preventDefault();
		if (!e.dataTransfer) return;
		e.dataTransfer.dropEffect = state.dropEffect;
	}

	function handle_dragenter(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.add(state.dragover_class);
	}

	function handle_dragleave(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;
		e.target.classList.remove(state.dragover_class);
	}

	node.addEventListener('dragover', handle_dragover);
	node.addEventListener('drop', handle_drop);
	node.addEventListener('dragenter', handle_dragenter);
	node.addEventListener('dragleave', handle_dragleave);

	return {
		update(options: DropzoneOptions) {
			state = {
				dropEffect: 'move' as DropEffect,
				dragover_class: 'droppable',
				...options
			};
		},
		destroy() {
			node.removeEventListener('dragover', handle_dragover);
			node.removeEventListener('drop', handle_drop);
			node.removeEventListener('dragenter', handle_dragenter);
			node.removeEventListener('dragleave', handle_dragleave);
		}
	};
}
