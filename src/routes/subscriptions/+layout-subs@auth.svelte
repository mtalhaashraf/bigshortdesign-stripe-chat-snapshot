<script>
	import { user } from '../../store/user';
	import Agreement from '../../shared/Agreement.svelte';
	import { firestore } from '$lib/firebase';
	import { onMount } from 'svelte';

	let portalURL = '';

	const isSubscribed = ({ authstate: { subscribed } }) => subscribed;

	const isAgreementSigned = ({ authstate: { agreement } }) => agreement || false;

	const handleAgreement = ({ detail }) => {
		firestore.setUserData($user.uid, {
			agreement: detail
		});
	};

	const handlePortal = () => {
		window.open(portalURL, '_blank');
	};

	onMount(async () => {
		if (isSubscribed($user)) {
			const response = await fetch('/api/stripe/create-customer-portal-session', {
				method: 'POST',
				body: JSON.stringify({
					customer_id: $user.stripe.customerId,
					return_url: '/subscriptions'
				}),
				headers: {
					'content-type': 'application/json'
				}
			}).then((res) => res.json());

			portalURL = response.url;
		}
	});
</script>

<!-- {#if isAgreementSigned($user)}
	{#if isSubscribed($user)}
		<div class="w-full h-full flex flex-col items-center justify-center">
			<a href="/">Home</a>
			<button on:click={handlePortal} class=" text-xl">Goto Portal</button>
		</div>
	{:else}
		<slot />
	{/if}
{:else}
	<Agreement on:submit={handleAgreement} />
{/if} -->

{#if isSubscribed($user)}
	<div class="w-full h-full flex flex-col items-center justify-center">
		<a href="/">Home</a>
		<button on:click={handlePortal} class=" text-xl">Goto Portal</button>
	</div>
{:else}
	<slot />
{/if}
