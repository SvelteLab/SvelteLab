import { writable } from 'svelte/store';

export const repl_id = writable<string | undefined>();
export const is_repl_saving = writable(false);
