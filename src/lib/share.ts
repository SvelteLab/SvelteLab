import { get } from 'svelte/store';
import { repl_id, repl_name } from './stores/repl_id_store';
import { error, success } from './toast';
import { webcontainer } from './webcontainer';
import { tabs } from './tabs';

export async function share_with_hash(with_files?: boolean) {
	const share_url = await webcontainer.get_share_url();
	if (with_files) {
		const open_files = get(tabs).join(',');
		share_url.searchParams.set('files', open_files);
	}
	await share({
		text: `Take a look at my REPL - ${get(repl_name)}`,
		title: 'Sveltelab',
		url: share_url.toString(),
	});
}

export async function share_with_id(with_files?: boolean) {
	const share_url = new URL(window.location.href);
	if (with_files) {
		const open_files = get(tabs).join(',');
		share_url.searchParams.set('files', open_files);
	}
	share_url.pathname = get(repl_id) ?? '';
	await share({
		text: `Take a look at my REPL - ${get(repl_name)}`,
		title: 'Sveltelab',
		url: share_url.toString(),
	});
}

export async function share(
	share_info: ShareData,
	fallback_success_text = 'Copied to clipboard.',
	fallback_error_text = 'There was a problem copying the URL',
) {
	if (share_info.url?.startsWith('/')) {
		const url = new URL(window.location.href);
		url.pathname = share_info.url;
		share_info.url = url.toString();
	}
	if (navigator.share) {
		navigator.share(share_info);
	} else {
		try {
			if (!share_info.url) throw '';
			await navigator.clipboard.writeText(share_info.url);
			success(fallback_success_text);
		} catch (e) {
			error(fallback_error_text);
		}
	}
}

export type ShareFn = typeof share;
