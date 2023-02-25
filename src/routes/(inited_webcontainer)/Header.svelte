<script>
	import Fork from '~icons/cil/fork';
	import ConfigFiles from '~icons/eos-icons/configuration-file';
	import PanelBottom from '~icons/fluent/panel-bottom-20-filled';
	import PanelLeft from '~icons/fluent/panel-left-20-filled';
	import Login from '~icons/material-symbols/login';
	import Save from '~icons/material-symbols/save';
	import NewFile from '~icons/mdi/file-document-add';
	import NewFolder from '~icons/mdi/folder-add';
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

	<button title="Save Changes">
		<Save />
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
