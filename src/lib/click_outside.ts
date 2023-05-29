export function click_outside(
	node: Node,
	{
		enabled: initial_enabled,
		func,
	}: {
		enabled: boolean;
		func: (node: Node) => unknown;
	}
) {
	const handle_outside_click = (event: MouseEvent) => {
		if (node.contains(event.target as Node)) return;
		func(node);
	};
	function update({ enabled }: { enabled: boolean }) {
		if (enabled) {
			window.addEventListener('click', handle_outside_click, true);
		} else {
			window.removeEventListener('click', handle_outside_click, true);
		}
	}
	update({ enabled: initial_enabled });
	return {
		update,
		destroy() {
			window.removeEventListener('click', handle_outside_click, true);
		},
	};
}
