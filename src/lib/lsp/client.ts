import { webcontainer } from '$lib/webcontainer';
import { LanguageServerClient, languageServerWithTransport } from 'codemirror-languageserver';
import { createWorkerMessage } from '$lib/lsp/svelte/index.js';
import { Transport } from '@open-rpc/client-js/src/transports/Transport';
import { getNotifications } from '@open-rpc/client-js/src/Request';
import type { IJSONRPCData, JSONRPCRequestData } from '@open-rpc/client-js/src/Request';
import SvelteLanguageWorker from '$lib/workers/svelte-language-server?worker';
import { get, writable } from 'svelte/store';
import type { Extension } from '@codemirror/state';
import { current_tab } from '$lib/tabs';

// Define the supported languages.
const lang_keys = ['svelte', 'svx', 'html', 'js', 'cjs', 'mjs', 'ts', 'css', 'json', 'md'] as const;

// Define the LanguageClient interface
interface LanguageClient {
	/* Define the properties/methods of the LanguageClient if necessary */
}

// utility function to skip the first invocation of a function
const skip_first = <T extends (...args: any[]) => any>(fn: T) => {
	let first = true;
	return (...args: Parameters<T>): ReturnType<T> => {
		if (first) {
			first = false;
			return;
		}
		return fn(...args);
	};
};

// Export the supported languages and type
export const supported_languages = lang_keys;
export type SupportedLanguage = (typeof lang_keys)[number];
export const is_supported_lang = (lang: string): lang is SupportedLanguage =>
	supported_languages.includes(lang as never);

// Define the PostMessageWorkerTransport class.
class PostMessageWorkerTransport extends Transport {
	public declare worker: undefined | null | Worker;
	public declare postMessageID: string;

	constructor(worker: Worker) {
		super();
		this.worker = worker;
		this.postMessageID = `post-message-transport-${Math.random()}`;
	}

	private messageHandler = (ev: MessageEvent) => {
		console.log('<-', ev.data);
		this.transportRequestManager.resolveResponse(JSON.stringify(ev.data));
	};

	public connect(): Promise<void> {
		return new Promise((resolve) => {
			if (this.worker) this.worker.addEventListener('message', this.messageHandler);
			resolve();
		});
	}

	public async sendData(data: JSONRPCRequestData): Promise<unknown> {
		console.log('->', data);
		const prom = this.transportRequestManager.addRequest(data, null);
		const notifications = getNotifications(data);
		if (this.worker) {
			this.worker.postMessage((data as IJSONRPCData).request);
			this.transportRequestManager.settlePendingRequest(notifications);
		}
		return prom;
	}

	public close(): void {
		if (this.worker) this.worker.terminate();
	}
}

// Global variables
const extensions = writable<Extension[]>([]);
const lang_clients = new Map<string, Extension[]>();

let svelte_language_worker: Worker = new SvelteLanguageWorker();
let language_client: LanguageServerClient | null = null;
let transport: PostMessageWorkerTransport | null = null;
let current_language_transport: Extension[] | undefined;
let is_initialized = false;
let current_tab_during_init: string | undefined = undefined;

svelte_language_worker.onmessage = (ev) => {
	const { data } = ev;
	if (data.type === 'error') {
		console.error(data.error);
	}
	const current_tab_value = get(current_tab);
	if (!is_initialized && data.method === 'setup-complete') {
		console.log('setup complete');
		is_initialized = true;
		if (current_tab_value === '/') {
			const current_tab_subscriber = current_tab.subscribe(
				skip_first((tab) => {
					if (tab !== '/') {
						get_language_client(tab);
						get_language_client(tab);
						current_tab_subscriber();
					}
				}),
			);
		} else {
			get_language_client(current_tab_value);
		}
	}
};

// Helper function to update the extensions with the new client
function update_extensions_with_client(client: Extension[]): void {
	extensions.update(($extensions) => [
		...$extensions.filter((ext) => ext !== current_language_transport),
		client,
	]);
}

// Function to get the language client for a specific URI
function get_language_client(uri: string, lang?: string): void {
	if ((!uri || uri === '/') && !transport && !language_client) return;

	if (lang_clients.has(uri)) {
		const client = lang_clients.get(uri);

		// If the current language client is not the same as the one for the current tab, swap them out
		if (client && current_language_transport !== client) {
			update_extensions_with_client(client);
			current_language_transport = client;
		}
	} else {
		// Create a new language client for the current tab if one doesn't exist
		const client: LanguageClient = languageServerWithTransport({
			transport: transport,
			rootUri: '/',
			workspaceFolders: null,
			documentUri: uri.replace('./', '/'),
			languageId: lang || '',
			allowHTMLContent: true,
			client: language_client,
			autoClose: false,
		});

		// Add the new language client to the language client map
		lang_clients.set(uri, client as Extension[]);

		update_extensions_with_client(client as Extension[]);

		current_language_transport = client as Extension[];
	}
}

const listen_for_files = webcontainer.on_fs_change('creation', (path) => {
	if (!is_initialized && path === './.svelte-kit/tsconfig.json') {
		is_initialized = true;
		webcontainer.read_file(path, true).then((file) => {
			svelte_language_worker.postMessage(createWorkerMessage('setup', { [path.slice(1)]: file }));

			return;
		});
	} else if (
		path === './tsconfig.json' ||
		path === './svelte.config.js' ||
		path === './.svelte-kit/ambient.d.ts'
	) {
		webcontainer.read_file(path, true).then((file) => {
			svelte_language_worker.postMessage(
				createWorkerMessage('add-files', {
					[path.slice(1)]: file,
				}),
			);
		});
	} else {
		webcontainer.read_file(path, true).then((file) => {
			// if (is_initialized) {
			svelte_language_worker.postMessage(
				createWorkerMessage('add-files', {
					[path.slice(1)]: file,
				}),
			);
			// }
		});
	}
});

const handle_config_changes = webcontainer.on_init(async () => {
	// Initialize the worker and set up the current_tab variable

	await webcontainer.read_package_json().then((json) => {
		svelte_language_worker.postMessage(createWorkerMessage('fetch-types', json));
	});
	// Create the transport and language client after the worker is set up
	// otherwise, the worker will not be able to respond to the client
	transport = new PostMessageWorkerTransport(svelte_language_worker);
	language_client = new LanguageServerClient({
		transport: transport,
		rootUri: '/',
		documentUri: '',
		languageId: '',
		workspaceFolders: null,
		autoClose: false,
	});
});

const current_tab_subscriber = current_tab.subscribe(
	skip_first((tab) => {
		if (tab) {
			get_language_client(tab.uri, tab.lang);
		}
	}),
);

const cleanup_language_client = () => {
	if (language_client) {
		language_client.close();
		language_client = null;
	}

	if (transport) {
		transport.close();
		transport = null;
	}

	lang_clients.clear();
	current_language_transport = undefined;
	handle_config_changes();
	listen_for_files();
	current_tab_subscriber();
};

export { extensions, cleanup_language_client };
