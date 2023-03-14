import { persisted } from 'svelte-local-storage-store';

interface TipsStore {
	no_config: boolean;
}

export const tips_store = persisted<TipsStore>('tips_preferences', {
	no_config: true
});
