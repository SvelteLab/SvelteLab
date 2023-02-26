<script>
	import { webcontainer } from '$lib/webcontainer';
	import Save from '~icons/akar-icons/cloud';
	import Fork from '~icons/akar-icons/copy';
	import Login from '~icons/akar-icons/face-happy';
	import NewFile from '~icons/akar-icons/file';
	import NewFolder from '~icons/akar-icons/folder-add';
	import PanelBottom from '~icons/akar-icons/panel-bottom';
	import PanelLeft from '~icons/akar-icons/panel-left';
	import ConfigFiles from '~icons/akar-icons/settings-horizontal';

	let saving = new Promise((resolve) => resolve(null));
</script>

<header>
	<button title="Toggle File Browser">
		<PanelLeft />
	</button>

	<button title="Toggle Terminal">
		<PanelBottom />
	</button>

	<button title="Toggle Config Files">
		<ConfigFiles />
	</button>
	<button title="Create File">
		<NewFile />
	</button>
	<button title="Create Folder">
		<NewFolder />
	</button>

	<span> Hello World </span>

	<button title="Fork Project">
		<Fork />
	</button>

	<button
		title="Save Changes"
		on:click={async () => {
			saving = webcontainer.save();
		}}
	>
		{#await saving}
			...
		{:then _}
			<Save />
		{/await}
	</button>

	<button title="Login">
		<Login />
	</button>
</header>

<style>
	header {
		padding: 1em 1.5em;
		display: flex;
		gap: 1em;
		background-color: var(--sk-back-2);
		position: relative;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.2);
	}

	button {
		font-size: 1.25em;
		display: grid;
		place-items: center;
	}

	button > :global(svg) {
		/* override site-kit */
		height: initial !important;
		width: initial !important;
	}

	span {
		margin-left: 2em;
		flex-grow: 1;
	}
</style>
