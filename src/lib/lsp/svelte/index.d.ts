import * as codemirror_languageserver from 'codemirror-languageserver';
import { Transport as Transport$1 } from '@open-rpc/client-js/build/transports/Transport';
import { LanguageServerClient } from 'codemirror-languageserver/';
import { PackageJson } from 'type-fest';
import { WorkspaceFolder } from 'vscode-languageserver-types';
import { Transport } from '@open-rpc/client-js/src/transports/Transport.js';
import { JSONRPCRequestData } from '@open-rpc/client-js/src/Request';

declare const workerRPCMethods: readonly ["@@setup", "@@add-files", "@@delete-file", "@@fetch-types"];
type WorkerRPCMethod = (typeof workerRPCMethods)[number];
type URI = string;
type FileContents$1 = string;
type WorkerMessage<T extends WorkerRPCMethod> = {
    method: T;
    id: number;
    params: Record<URI, FileContents$1>;
};
type SetupMessage = WorkerMessage<"@@setup">;
type AddFilesMessage = WorkerMessage<"@@add-files">;
type FetchTypesMessage = WorkerMessage<"@@fetch-types">;
type DeleteFileMessage = WorkerMessage<"@@delete-file">;
type WorkerResponse<T extends WorkerRPCMethod> = {
    method: T;
    complete: boolean;
    id: number;
};

declare const createWorkerMessage: <T extends "@@setup" | "@@add-files" | "@@delete-file" | "@@fetch-types">(method: "setup" | "add-files" | "fetch-types" | "delete-file", id: number, params: Record<string, string>) => WorkerMessage<T>;

declare class PostMessageWorkerTransport extends Transport {
    worker: undefined | null | Worker;
    postMessageID: string;
    constructor(worker: Worker);
    private messageHandler;
    connect(): Promise<void>;
    sendData(data: JSONRPCRequestData, _timeout?: number | null): Promise<any>;
    close(): void;
}

interface LanguageServerBaseOptions {
    rootUri: string | null;
    workspaceFolders: WorkspaceFolder[] | null;
    documentUri: string;
    languageId: string;
}
interface LanguageServerClientOptions extends LanguageServerBaseOptions {
    transport: Transport$1 | WorkerRPC;
    autoClose?: boolean;
}
interface LanguageServerOptions extends LanguageServerClientOptions {
    client?: LanguageServerClient;
    allowHTMLContent?: boolean;
}
type FileName = string;
type FileContents = string;
type Files = Record<FileName, FileContents>;
/**
 * A class that wraps the Worker and provides a simple RPC interface.
 *
 * @example
 * C
 * ```ts
 * const svelteRpc = new WorkerRPC("/path/to/worker.js", {
 * 	languageId: "svelte",
 * 	rootUri: "/",
 * });
 *
 * worker.fetchTypes("
 * worker.addFiles({
 * 	"App.svelte": `<script>let foo = "bar";</script><p>{foo}</p>`,
 * });
 *
 * worker.fetchTypes("App.svelte").then((success) => {
 * 	if (success) {
 * 		const client = worker.client();
 * 		const diagnostics = client.getDiagnostics("App.svelte");
 * 		console.log(diagnostics);
 * 	}
 * });
 * ```
 */
declare class WorkerRPC extends PostMessageWorkerTransport {
    private options;
    private internalMessageId;
    private rpcQueue;
    private langClient;
    private worker;
    /**
     * Creates the language Worker from the provided URL.
     * @param worker The URL to the worker file.
     * @param options The options to pass to the Language Client.
     */
    constructor(worker: URL, options: Omit<LanguageServerOptions, "transport">);
    /**
     *  Uses a pre-existing instance of the Worker
     * @param worker The instantiated Worker.
     * @param options The options to pass to the Language Client.
     *
     */
    constructor(worker: Worker, options: Omit<LanguageServerOptions, "transport">);
    /**
     *  Creates the language Worker from the provided string.
     *  When using a string, it is assumed that it is an absolute path to the worker file.
     * @param worker The path to the worker file.
     * @param options The options to pass to the Language Client.
     */
    constructor(worker: string, options: Omit<LanguageServerOptions, "transport"> & {
        transport: WorkerRPC;
    });
    client: () => codemirror_languageserver.LanguageServerClient;
    dispose(): void;
    sendNotification(method: string, params: object | any[]): void;
    /**
     * Sends an object containing files to add to the Worker.
     *
     * @param files - An object containing the files to add.
     */
    addFiles(files: Files): Promise<boolean>;
    /**
     * Sends a single file to add to the Worker.
     *
     * @param name - The name of the file.
     * @param content - The contents of the file.
     */
    addFiles(name: string, content: string): Promise<boolean>;
    /**
     * Sends a request to the Worker to fetch the types for the provided files.
     *
     * @param packageJson - An object representing the package.json file.
     * @returns A promise that resolves when the Worker has finished fetching the types.
     * The promise resolves to a boolean indicating whether the fetch was successful.
     */
    fetchTypes(pkgJson: PackageJson): Promise<boolean>;
    /**
     * Sends a request to the Worker to fetch the types for the provided files.
     *
     * @param files - An object containing the files to fetch types for.
     * @returns A promise that resolves when the Worker has finished fetching the types.
     * The promise resolves to a boolean indicating whether the fetch was successful.
     */
    setup(configFiles: Files): Promise<LanguageServerClient>;
    setup(configFile: string, configContents: string): Promise<LanguageServerClient>;
    /**
     * Sends a request to the Worker to delete the provided file matching the given file name.
     *
     * @param fileName - The name of the file to delete.
     * @returns A promise that resolves when the Worker has finished deleting the file.
     */
    deleteFile(fileName: string): Promise<boolean>;
    private sendDeleteFile;
    private onMessage;
    private sendAddFiles;
    private sendFetchTypes;
    private sendSetup;
}

export { AddFilesMessage, DeleteFileMessage, FetchTypesMessage, SetupMessage, WorkerMessage, WorkerRPC, WorkerRPCMethod, WorkerResponse, createWorkerMessage, workerRPCMethods };
