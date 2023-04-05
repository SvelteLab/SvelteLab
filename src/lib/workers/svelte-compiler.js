// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
self.window = self; // egregious hack to get magic-string to work in a worker

let fulfil_ready;
const ready = new Promise((f) => {
	fulfil_ready = f;
});

self.addEventListener('message', async (event) => {
	switch (event.data.type) {
		case 'init':
			try {
				// eslint-disable-next-line no-undef
				importScripts(`https://unpkg.com/svelte/compiler.js`);
			} catch {
				await import(/* @vite-ignore */ `https://unpkg.com/svelte/compiler.js`);
			}

			fulfil_ready();
			break;

		case 'compile':
			await ready;
			try {
				postMessage(compile(event.data));
			} catch (e) {
				/*empty*/
				console.log(e);
			}
			break;
	}
});

const common_options = {
	dev: false,
	css: true
};

function compile({ id, source, options, return_ast }) {
	try {
		// eslint-disable-next-line no-undef
		const { warnings, ast } = svelte.compile(source, Object.assign({}, common_options, options));
		for (let warning of warnings) {
			delete warning.toString;
		}
		return {
			id,
			result: {
				ast: return_ast ? ast : null,
				warnings
			}
		};
	} catch (e) {
		return {
			id,
			result: {
				error: {
					message: e.message,
					name: e.name,
					code: e.code,
					start: e.start,
					end: e.end,
					pos: e.pos,
					frame: e.frame
				}
			}
		};
	}
}
