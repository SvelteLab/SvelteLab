<script>
	import { page } from '$app/stores';
	import { ICON } from '$lib/icons';
	import { error } from '@sveltejs/kit';

	export let data;
	export let form;
</script>

<form method="POST">
	<h2>Register</h2>
	<label>
		Email*
		<input type="email" name="email" required />
	</label>
	<label>
		Password*
		<input type="password" name="password" required />
	</label>
	<label>
		Password Confirm*
		<input type="password" name="passwordConfirm" required />
	</label>
	<label>
		Name
		<input type="text" name="name" />
	</label>
	{#if form?.error}
		<section data-error>
			Error: <br />
			{form.error}
		</section>
	{/if}
	<button>
		<ICON.Register />
		Register
	</button>
	<hr />
	{#if data.github_login}
		<a href={`${data.github_login?.authUrl}${data.REDIRECT_URI}${$page.url.pathname}`}>
			<ICON.Github /> Login with GitHub
		</a>
	{/if}
	<a href="/login">
		<ICON.Login />
		Login
	</a>
</form>

<style src="../auth.css"></style>
