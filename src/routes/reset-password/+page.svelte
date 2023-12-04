<script>
	import { auth } from '$lib/firebase';
	import { equals } from 'ramda';
	import FormInput from '../../shared/Inputs/FormInput.svelte';
	let password = '';
	let confirm_password = '';
	let loading = false;
	let error = '';

	$: {
		if (password && confirm_password) {
			if (equals(password, confirm_password)) {
				error = '';
			} else error = 'Passwords not matched';
		} else {
			error = '';
		}
	}

	const handleChangePassword = () => {
		loading = true;
		if (equals(password, confirm_password))
			auth
				.updateUserPassword(password)
				.then(() => {
					alert('Password changed successfully');
					loading = false;
				})
				.catch((error) => {
					if (error.message) alert(error.message);
					loading = false;
				});
		else {
			error = 'Passwords not matched';
			loading = false;
		}
	};
</script>

<div class="page-content">
	<div class="login-screen">
		<div class="logo">
			<img src="/favicon.png" alt="" /><img src="assets/images/logo.png" alt="" />
		</div>
		<form class="form-area" on:submit|preventDefault={handleChangePassword}>
			<FormInput
				bind:value={password}
				type="password"
				required={true}
				label="Enter A New Password"
			/>
			<FormInput
				bind:value={confirm_password}
				type="password"
				required={true}
				label="Retype Your New Password"
			/>

			<p class="text-center text-red-900 m-2 text-sm">{error}</p>

			<button disabled={loading} class="btn primary-btn"
				>{#if loading}
					Loading...
				{:else}
					Change Password
				{/if}</button
			>
		</form>
	</div>
</div>
