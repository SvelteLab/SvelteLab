/// <reference types="unplugin-icons/types/svelte" />

import type { Admin, Record } from 'pocketbase';
import type PoketBase from 'pocketbase';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pocketbase: PoketBase;
			user: Admin | Record | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
