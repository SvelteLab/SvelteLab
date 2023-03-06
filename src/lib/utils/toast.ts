import { toast } from '@zerodevx/svelte-toast';

export function success(msg: string) {
	toast.push(msg);
}

export function error(msg = 'Errors were made') {
	toast.push(msg, {
		theme: {
			'--toastBarBackground': '#ff0000'
		}
	});
}
