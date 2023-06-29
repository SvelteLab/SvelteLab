<script>
	import { page } from '$app/stores';
	import { ICON } from '$lib/icons';

	export let data;
	export let form;
</script>

<form method="POST">
	<h2>Login</h2>
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<label>
		Password
		<input type="password" name="password" />
	</label>
	{#if form?.error}
		<section data-error>
			Error: <br />
			{form.error}
		</section>
	{/if}
	<button>
		<ICON.Login />
		Login
	</button>
	<hr />

	{#if data.github_login}
		<a href={`${data.github_login?.authUrl}${data.REDIRECT_URI}${$page.url.pathname}`}>
			<ICON.Github /> Login with GitHub
		</a>
	{/if}
	<a href="/register">
		<ICON.Register />
		Register
	</a>
</form>

<style src="../auth.css"></style>
