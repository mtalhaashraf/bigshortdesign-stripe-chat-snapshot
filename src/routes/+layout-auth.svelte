<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth, firestore } from '$lib/firebase';
	import { getIpAddress } from '$lib/handlers/api';
	import { equals, hasPath, includes, pick, __ } from 'ramda';
	import { onDestroy, onMount } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	import '../app.css';
	import LoginForm from '../components/form/LoginForm.svelte';
	import routes, { noAuthRoutes } from '../routes';
	import ModelLayout from '../shared/ModelLayout.svelte';
	import { initialvalue, user } from '../store/user';

	let unsubscribeObservable;
	let unsubscribeSnapshot;
	let loading = true;
	let username;

	const isNoAuthRoute = includes(__, noAuthRoutes);

	const isDashboardAccess = ({ authstate: { authenticated, usernameExisted, otherDevice } }) => {
		if (authenticated && usernameExisted && !otherDevice) {
			return true;
		}
		return false;
	};

	const setAuthState = ({ subscribed, agreement, authenticated, usernameExisted, otherDevice }) => {
		$user.authstate = {
			subscribed,
			authenticated,
			usernameExisted,
			agreement,
			otherDevice
		};
		loading = false;
	};

	const resetAuthState = () => {
		$user = { ...initialvalue };
		$user.authstate.authenticated = false;
		loading = false;
	};

	const setUsername = async () => {
		const regex = new RegExp(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
		);

		if (!regex.test(username)) {
			alert(
				'Username must contain atleast \n1 Number\n1 Uppercase character\n1 Lowercase character\n1 Special character'
			);
			return;
		}
		const { uid } = $user;
		await firestore.setUserData(uid, { username });
		$user.username = username;
		setAuthState({ ...$user.authstate, usernameExisted: true });
	};

	const handleLogoutOthersDevices = async () => {
		const ip = localStorage.getItem('ipAddress');
		await firestore.setUserData($user.uid, { ipAddress: ip });
		await auth.logout();
		resetAuthState();
	};

	$: {
		if ($user.authstate.authenticated && isNoAuthRoute($page.url.pathname)) {
			goto(routes.home());
		}

		// if (
		// 	$user.authstate.authenticated &&
		// 	$user.authstate.usernameExisted &&
		// 	!$user.authstate.subscribed
		// ) {
		// 	goto(routes.subscriptions());
		// }
	}

	$: {
		if ($user.uid && $user.photoURL && !unsubscribeSnapshot) {
			const { uid, accessToken, metadata, displayName, email, ipAddress, emailVerified, photoURL } =
				$user;

			console.log('Realtime');
			unsubscribeSnapshot = firestore.getUserSnap(uid, async (doc) => {
				if (doc.exists()) {
					let state = {
						agreement: false,
						subscribed: false,
						otherDevice: false,
						authenticated: false,
						usernameExisted: false,
						customerId: null
					};
					let updatedData = {
						metadata: pick(['creationTime', 'lastSignInTime'], metadata)
					};
					const data = doc.data();

					if (!data.accessToken || !data.ipAddress) {
						updatedData.accessToken = accessToken;
						updatedData.ipAddress = ipAddress;
						state.authenticated = true;
					} else {
						if (equals(accessToken, data.accessToken) && equals(ipAddress, data.ipAddress)) {
							state.authenticated = true;
						} else if (
							!equals(accessToken, data.accessToken) &&
							equals(ipAddress, data.ipAddress)
						) {
							state.authenticated = true;
							updatedData.accessToken = accessToken;
						} else {
							console.log(data);
							state.otherDevice = true;
						}
					}
					if (data.username) {
						state.usernameExisted = true;
						$user.username = data.username;
					}
					if (hasPath(['stripe', 'subscriptionId'])(data) && data.stripe.subscriptionId) {
						state.subscribed = true;
						$user.stripe = data.stripe;
					}
					if (data.agreement) {
						state.agreement = true;
					}
					setAuthState({ ...state });
					await firestore.setUserData(uid, {
						...updatedData
					});
				} else {
					//addUser
					await firestore.setUserData(uid, {
						email,
						emailVerified,
						displayName,
						photoURL,
						ipAddress,
						accessToken,
						userGroup: 'guest'
					});
				}
			});
		}
	}

	const onChange = async (userdata) => {
		loading = true;
		try {
			if (!userdata) {
				console.log('User not found');
				unsubscribeSnapshot && unsubscribeSnapshot();
				unsubscribeSnapshot = null;
				resetAuthState();
				localStorage.removeItem('announs');
			} else {
				const { uid, accessToken, metadata, displayName, email, emailVerified, photoURL } =
					userdata;

				localStorage.setItem('token', accessToken);

				const ipAddress = await getIpAddress();

				console.log('Ip Address fetched');

				$user.uid = uid;
				$user.email = email;
				$user.metadata = metadata;
				$user.ipAddress = ipAddress;
				$user.accessToken = accessToken;
				$user.displayName = displayName;
				$user.emailVerified = emailVerified;
				$user.photoURL = photoURL;
			}
		} catch (error) {
			resetAuthState();
			alert('Server Error');
			await auth.logout();
		}
	};

	onMount(() => {
		unsubscribeObservable = auth.subscribeStateChangedObserver(onChange);
	});

	onDestroy(() => {
		unsubscribeSnapshot && unsubscribeSnapshot();
		unsubscribeObservable && unsubscribeObservable();
	});
</script>

<ModelLayout title="Signout from other devices!" hidden={!$user.authstate.otherDevice}>
	<button class="text-black border-2 p-2" on:click={handleLogoutOthersDevices}>
		Logout of other devices
	</button>
</ModelLayout>

{#if loading}
	<div class="loader">
		<Wave size="30" color="#FF3E00" unit="px" duration="1s" />
	</div>
{:else if !$user.authstate.authenticated && isNoAuthRoute($page.url.pathname)}
	<slot />
{:else if !$user.authstate.authenticated}
	<LoginForm />
{:else if !$user.authstate.usernameExisted}
	<div class="login-screen">
		<form class="form-area" on:submit|preventDefault={setUsername}>
			<div class="form-group">
				<label for="">Username:</label>
				<input
					type="text"
					minlength={8}
					maxlength={30}
					required
					bind:value={username}
					placeholder="Username.."
				/>
			</div>
			<button type="submit" disabled={loading} class="btn primary-btn"> Set Username </button>
		</form>
	</div>
{:else if !$user.authstate.subscribed && equals($page.url.pathname, routes.subscriptions())}
	<slot />
{:else if isDashboardAccess($user)}
	<slot />
{/if}

<style>
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
