<script lang="ts">
	import { layout_store } from '$lib/stores/layout_store';
	import { fit_addon, terminal } from '$lib/terminal';

	export const update_height = () => {
		fit_addon.fit();
	};

	$: {
		$layout_store.terminal;
		setTimeout(() => {
			update_height();
		}, 300);
	}

	function attach_terminal(node: HTMLDivElement) {
		terminal.open(node);
		setTimeout(() => {
			update_height();
		}, 300);
	}
</script>

<div use:attach_terminal></div>

<style>
	div {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
	div :global(.xterm) {
		height: 100%;
	}
</style>
