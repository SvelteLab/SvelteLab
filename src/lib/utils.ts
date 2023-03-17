export function deferred_promise() {
	type PromiseArgs = (value?: unknown) => void;
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	let resolve: PromiseArgs = () => {};
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	let reject: PromiseArgs = () => {};
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return {
		resolve,
		reject,
		promise
	};
}

/**
 * Action to do something async before navigating away with an anchor tag
 */
export function async_click(
	node: HTMLAnchorElement,
	click_handler: (e: MouseEvent) => Promise<void>
) {
	const generate_on_click =
		(click_handler: (e: MouseEvent) => Promise<void>) => async (e: MouseEvent) => {
			e.preventDefault();
			await click_handler(e);
			window.location.assign(node.href);
		};
	let on_click = generate_on_click(click_handler);
	node.addEventListener('click', on_click);
	return {
		destroy() {
			node.removeEventListener('click', on_click);
		},
		update(new_click_handler: (e: MouseEvent) => Promise<void>) {
			node.removeEventListener('click', on_click);
			on_click = generate_on_click(new_click_handler);
			node.addEventListener('click', on_click);
		}
	};
}
