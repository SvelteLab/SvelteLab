import { persisted } from 'svelte-local-storage-store';
import { get, writable } from 'svelte/store';

export const intro_hidden_forever = persisted('intro_hidden_forever', false);

export const is_intro_open = writable(!get(intro_hidden_forever));
