<script>
	import { ICON } from '$lib/icons';

	export let form;
</script>

<form method="POST">
	<h1>Login</h1>
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
			There was an authentication error.<br />
			Did you use the correct email and password?
		</section>
	{/if}
	<button>
		<ICON.Login />
		Login
	</button>
	<hr />
	<a href="/register">
		<ICON.Register />
		go to register
	</a>
</form>

<style src="../auth.css"></style>
