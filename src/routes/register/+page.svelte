<script>
	import { ICON } from '$lib/icons';

	export let form;
</script>

<form method="POST">
	<h1>Register</h1>
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
			There was an authentication error.<br />
			Did the passwords match?
		</section>
	{/if}
	<button>
		<ICON.Register />
		Register
	</button>
	<hr />
	<a href="/login">
		<ICON.Login />
		go to login
	</a>
</form>

<style src="../auth.css"></style>
