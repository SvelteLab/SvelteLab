/**
 * This is the entry point for the TypeScript Language Server Web Worker.
 * It will wait for a message containing any config files (package.json, tsconfig.json, etc)
 * from the main thread, and then start the server.
 *
 * @example
 * Creating the Language Server module:
 * ```ts
 * // worker.ts
 * import { TypeScriptWorker } from "svelte-language-server-web";
 *
 * export default TypeScriptWorker();
 *
 * ```
 *
 * @example
 * Using the worker:
 * ```ts
 * // main.ts
 *
 * const tsWorker = new Worker(new URL("./worker.ts", import.meta.url), { type: 'module' });
 *
 * ```
 */
declare const TypeScriptWorker: () => void;

export { TypeScriptWorker };
