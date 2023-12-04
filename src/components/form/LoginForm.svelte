<script>
	import { auth } from '$lib/firebase';
	import { has } from 'ramda';
	import routes from '../../routes';

	let email;
	let password;
	let loading = false;

	const handleSignIn = (method) => async () => {
		loading = true;
		try {
			await method();
		} catch (error) {
			if (has('code')(error)) {
				console.log(error.code);
				alert(error.code);
			}
		}
		loading = false;
	};
</script>

<div class="login-screen">
	<div class="logo">
		<img src="/assets/images/favicon.png" alt="" /><img src="/assets/images/logo.png" alt="" />
	</div>
	<form
		class="form-area"
		on:submit|preventDefault={handleSignIn(() => auth.login(email, password))}
	>
		<div class="form-group">
			<label for="">Email:</label>
			<input type="email" required bind:value={email} placeholder="Email" />
		</div>
		<div class="form-group">
			<label for="">Password:</label>
			<input type="password" required bind:value={password} minlength={6} placeholder="Password" />
		</div>
		<button type="submit" disabled={loading} class="btn primary-btn">
			{#if loading}
				Loading...
			{:else}
				Login
			{/if}
		</button>
	</form>

	<div class="forget-password">
		<p>Forgot your password? <a href={routes.forget_password()}>Reset Now</a></p>
	</div>
	<div class="sso-login">
		<div class="sso-btn" on:click={handleSignIn(auth.providers.signInWithGoogle)}>
			<div class="icon"><img src="/assets/images/icons8-google.png" alt="" /></div>
			<div class="text">Login with Google</div>
		</div>
		<div class="sso-btn" on:click={handleSignIn(auth.providers.signInWithFacebook)}>
			<div class="icon"><img src="/assets/images/icons8-facebook.png" alt="" /></div>
			<div class="text">Login with Facebook</div>
		</div>
		<div class="sso-btn" on:click={handleSignIn(auth.providers.signInWithTwitter)}>
			<div class="icon"><img src="/assets/images/icons8-twitter.png" alt="" /></div>
			<div class="text">Login with Twitter</div>
		</div>
	</div>
	<div class="forget-password">
		<p>Don't have an account? <a href={routes.signup()}>Create Now</a></p>
	</div>
</div>
