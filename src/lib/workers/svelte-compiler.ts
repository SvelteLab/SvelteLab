self.window = self; // egregious hack to get magic-string to work in a worker

let fulfil_ready: (value?: unknown) => void;
const ready = new Promise((f) => {
	fulfil_ready = f;
});

self.addEventListener('message', async (event) => {
	switch (event.data.type) {
		case 'init':
			try {
				importScripts(`https://unpkg.com/svelte/compiler.js`);
			} catch {
				await import(/* @vite-ignore */ `https://unpkg.com/svelte/compiler.js`);
			}

			fulfil_ready();
			break;

		case 'compile':
			await ready;
			postMessage(compile(event.data));
			break;
	}
});

const common_options = {
	dev: false,
	css: true
};

function compile({
	id,
	source,
	options,
	return_ast
}: {
	id: string;
	source: string;
	options: unknown;
	return_ast: boolean;
}) {
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { js, css, ast } = svelte.compile(source, Object.assign({}, common_options, options));

		return {
			id,
			result: {
				js: js.code,
				css: css.code || `/* Add a <sty` + `le> tag to see compiled CSS */`,
				ast: return_ast ? ast : null
			}
		};
	} catch (e) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const err = e as any;
		let message = `/* Error compiling component\n\n${err.message}`;
		if (err.frame) message += `\n${err.frame}`;
		message += `\n\n*/`;

		return {
			id,
			result: {
				js: message,
				css: message
			}
		};
	}
}
