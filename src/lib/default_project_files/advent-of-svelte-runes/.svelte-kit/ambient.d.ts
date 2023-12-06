
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const FIG_PID: string;
	export const NVM_INC: string;
	export const MANPATH: string;
	export const _VOLTA_TOOL_RECURSION: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_dependencies__fontsource_mountains_of_christmas: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_devDependencies_prettier_plugin_svelte: string;
	export const INIT_CWD: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const CLICOLOR: string;
	export const FIGTERM_SESSION_ID: string;
	export const HISTSIZE: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_scripts_lint: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_scripts_dev: string;
	export const MallocNanoZone: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const VOLTA_HOME: string;
	export const npm_package_private: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const FIG_SET_PARENT_CHECK: string;
	export const HISTFILESIZE: string;
	export const NVM_DIR: string;
	export const USER: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const LSCOLORS: string;
	export const npm_config_frozen_lockfile: string;
	export const PATH: string;
	export const LaunchInstanceID: string;
	export const npm_config_engine_strict: string;
	export const __CFBundleIdentifier: string;
	export const PWD: string;
	export const TTY: string;
	export const npm_command: string;
	export const npm_package_scripts_preview: string;
	export const npm_lifecycle_event: string;
	export const LANG: string;
	export const npm_package_name: string;
	export const FIG_SCRIPTS_KEYBIND: string;
	export const NODE_PATH: string;
	export const npm_package_scripts_build: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const XPC_FLAGS: string;
	export const PS3: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const HOME: string;
	export const SHLVL: string;
	export const npm_package_type: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const HOMEBREW_PREFIX: string;
	export const LOGNAME: string;
	export const npm_package_scripts_format: string;
	export const npm_lifecycle_script: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const NVM_BIN: string;
	export const npm_config_user_agent: string;
	export const GIT_ASKPASS: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const SECURITYSESSIONID: string;
	export const npm_package_overrides__sveltejs_kit_undici: string;
	export const COLORTERM: string;
	export const FIG_TERM: string;
	export const npm_node_execpath: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		FIG_PID: string;
		NVM_INC: string;
		MANPATH: string;
		_VOLTA_TOOL_RECURSION: string;
		npm_package_devDependencies_prettier: string;
		npm_package_dependencies__fontsource_mountains_of_christmas: string;
		TERM_PROGRAM: string;
		NODE: string;
		NVM_CD_FLAGS: string;
		npm_package_devDependencies_prettier_plugin_svelte: string;
		INIT_CWD: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		CLICOLOR: string;
		FIGTERM_SESSION_ID: string;
		HISTSIZE: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_scripts_lint: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_scripts_dev: string;
		MallocNanoZone: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		VOLTA_HOME: string;
		npm_package_private: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		FIG_SET_PARENT_CHECK: string;
		HISTFILESIZE: string;
		NVM_DIR: string;
		USER: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		LSCOLORS: string;
		npm_config_frozen_lockfile: string;
		PATH: string;
		LaunchInstanceID: string;
		npm_config_engine_strict: string;
		__CFBundleIdentifier: string;
		PWD: string;
		TTY: string;
		npm_command: string;
		npm_package_scripts_preview: string;
		npm_lifecycle_event: string;
		LANG: string;
		npm_package_name: string;
		FIG_SCRIPTS_KEYBIND: string;
		NODE_PATH: string;
		npm_package_scripts_build: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		XPC_FLAGS: string;
		PS3: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		HOME: string;
		SHLVL: string;
		npm_package_type: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		HOMEBREW_PREFIX: string;
		LOGNAME: string;
		npm_package_scripts_format: string;
		npm_lifecycle_script: string;
		VSCODE_GIT_IPC_HANDLE: string;
		NVM_BIN: string;
		npm_config_user_agent: string;
		GIT_ASKPASS: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		SECURITYSESSIONID: string;
		npm_package_overrides__sveltejs_kit_undici: string;
		COLORTERM: string;
		FIG_TERM: string;
		npm_node_execpath: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
