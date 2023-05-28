import { toast } from '@zerodevx/svelte-toast';
import ActionableToast from './components/ActionableToast.svelte';

export function success(msg: string) {
	toast.push(msg);
}

export function error(msg = 'Errors were made') {
	toast.push(msg, {
		theme: {
			'--toastBarBackground': '#ff0000',
		},
	});
}

export function actionable(message: string, on_action: () => void, action_message: string) {
	toast.push({
		initial: 0,
		dismissable: true,
		component: {
			src: ActionableToast,
			props: {
				message,
				on_action,
				action_message,
			},
			sendIdTo: 'toast_id',
		},
	});
}
