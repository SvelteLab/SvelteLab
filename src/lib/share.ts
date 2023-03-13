import { error, success } from './toast';

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
