var o = ['@@setup', '@@add-files', '@@fetch-types'],
	p = (e, s) => ({ method: `@@${e}`, params: s });
export { p as createWorkerMessage, o as workerRPCMethods };
//# sourceMappingURL=index.js.map
