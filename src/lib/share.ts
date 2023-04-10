import { get } from 'svelte/store';
import { repl_id, repl_name } from './stores/repl_id_store';
import { error, success } from './toast';
import { webcontainer } from './webcontainer';

export async function share_with_hash() {
	const share_url = await webcontainer.get_share_url();
	await share({
		text: `Take a look at my REPL - ${get(repl_name)}`,
		title: 'Sveltelab',
		url: share_url.toString()
	});
}

export async function share_with_id() {
	const share_url = new URL(window.location.href);
	share_url.pathname = get(repl_id) ?? '';
	await share({
		text: `Take a look at my REPL - ${get(repl_name)}`,
		title: 'Sveltelab',
		url: share_url.toString()
	});
}

export async function share(
	shareInfo: ShareData,
	fallbackSuccessText = 'Copied to clipboard.',
	fallbackErrorText = 'There was a problem copying the URL'
) {
	if (shareInfo.url?.startsWith('/')) {
		const url = new URL(window.location.href);
		url.pathname = shareInfo.url;
		shareInfo.url = url.toString();
	}
	if (navigator.share) {
		navigator.share(shareInfo);
	} else {
		try {
			if (!shareInfo.url) throw '';
			await navigator.clipboard.writeText(shareInfo.url);
			success(fallbackSuccessText);
		} catch (e) {
			error(fallbackErrorText);
		}
	}
}

export type ShareFn = typeof share;
