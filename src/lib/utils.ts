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
