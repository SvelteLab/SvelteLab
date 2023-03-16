import { writable } from 'svelte/store';

export const repl_id = writable<string | undefined>();
export const repl_name = writable<string>('Hello world');
export const is_repl_saving = writable(false);
export const is_repl_to_save = writable(false);
