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
		promise,
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
		},
	};
}

export function get_character_from_pos(line: number, column: number, source: string) {
	const lines = source.split('\n');
	let sum = column;
	for (let i = 0; i < line - 1; i++) {
		sum += (lines.shift()?.length ?? 0) + 1;
	}
	return sum;
}

type Version = `${number}.${number}.${number}`;

/**
 * Function to compare to version number
 * @param {Version} version_a First number version
 * @param {Version} version_b Second number version
 * @returns {-1|1|0} 1 if version_a is greater than version_b,
 * -1 if version_b is greater than version_a, 0 if they are equal
 */
export function version_compare(version_a: Version, version_b: Version) {
	const [major_a, minor_a, patch_a] = version_a.split('.').map((part) => parseInt(part));
	const [major_b, minor_b, patch_b] = version_b.split('.').map((part) => parseInt(part));
	if (major_a > major_b) return 1;
	if (major_a < major_b) return -1;
	if (minor_a > minor_b) return 1;
	if (minor_a < minor_b) return -1;
	if (patch_a > patch_b) return 1;
	if (patch_a < patch_b) return -1;
	return 0;
}
