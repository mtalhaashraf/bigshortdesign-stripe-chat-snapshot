<script>
	import { auth } from '$lib/firebase';
	import { equals, has } from 'ramda';
	import routes from '../../routes';

	let email;
	let password;
	let confirm_password;
	let error = '';
	let loading = false;

	const register = async () => {
		loading = true;
		error = '';
		if (equals(password, confirm_password)) {
			try {
				await auth.signUp(email, password);
			} catch (error) {
				if (has('code')(error)) {
					console.log(error.code);
					alert(error.code);
				}
			}
		} else alert('Password and confirm password does not match');
		loading = false;
	};

	const handleSignUp = (method) => async () => {
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

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<div class="page-content">
	<div class="login-screen">
		<div class="logo">
			<img src="/assets/images/favicon.png" alt="" /><img src="/assets/images/logo.png" alt="" />
		</div>
		<form class="form-area" on:submit|preventDefault={register}>
			<div class="form-group">
				<label for="">Email:</label>
				<input type="email" required bind:value={email} placeholder="Email" />
			</div>
			<div class="form-group">
				<label for="">Password:</label>
				<input
					type="password"
					required
					bind:value={password}
					minlength={6}
					placeholder="Password"
				/>
			</div>
			<div class="form-group">
				<label for="">Confirm password:</label>
				<input
					type="password"
					required
					bind:value={confirm_password}
					minlength={6}
					placeholder="Confirm password"
				/>
			</div>
			<button type="submit" disabled={loading} class="btn primary-btn">
				{#if loading}
					Loading...
				{:else}
					SignUp
				{/if}
			</button>
		</form>

		<div class="forget-password">
			<p>Forgot your password? <a href={routes.reset_password()}>Reset Now</a></p>
		</div>
		<div class="sso-login">
			<div class="sso-btn" on:click={handleSignUp(auth.providers.signInWithGoogle)}>
				<div class="icon"><img src="/assets/images/icons8-google.png" alt="" /></div>
				<div class="text">Login with Google</div>
			</div>
			<div class="sso-btn" on:click={handleSignUp(auth.providers.signInWithFacebook)}>
				<div class="icon"><img src="/assets/images/icons8-facebook.png" alt="" /></div>
				<div class="text">Login with Facebook</div>
			</div>
			<div class="sso-btn" on:click={handleSignUp(auth.providers.signInWithTwitter)}>
				<div class="icon"><img src="/assets/images/icons8-twitter.png" alt="" /></div>
				<div class="text">Login with Twitter</div>
			</div>
		</div>
		<div class="forget-password">
			<p>Already have an account? <a href={routes.login()}>Login</a></p>
		</div>
	</div>
</div>
