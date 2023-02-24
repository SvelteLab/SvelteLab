<script lang="ts">
	import { webcontainer } from '$lib/webcontainer';
	import '../../styles/global.css';
</script>

{#await webcontainer.init()}
	Booting up webcontainer...
{:then _}
	<slot />
{/await}
