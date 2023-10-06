/**
 * This is the entry point for the Svelte Language Server Web Worker.
 * It will wait for a message containing any config files (svelte.config.js, tsconfig.json, etc)
 * from the main thread, and then start the server.
 *
 * @example
 * Creating the Language Server module:
 * ```ts
 * // worker.ts
 * import { BaseWorker } from "svelte-language-server-web";
 *
 * export default SvelteLanguageWorker();
 *
 * ```
 *
 * @example
 * Using the worker:
 * ```ts
 * // main.ts
 *
 * const svelteWorker = new Worker(new URL("./worker.ts", import.meta.url), { type: 'module' });
 *
 * ```
 */
declare const SvelteLanguageWorker: () => void;

export { SvelteLanguageWorker };
