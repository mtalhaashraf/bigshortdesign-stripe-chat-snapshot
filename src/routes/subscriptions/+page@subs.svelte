<script>
	import { onMount } from 'svelte';
	import { both, complement, equals, has, hasPath, isNil } from 'ramda';
	import { products } from '../../store/products';
	import { user } from '../../store/user';
	import routes from '../../routes';
	import SubscriptionCard from '../../components/subscription/SubscriptionCard.svelte';
	import { Wave } from 'svelte-loading-spinners';
	import Agreement from '../../shared/Agreement.svelte';
	import { firestore } from '$lib/firebase';

	let loading = false;

	let agreement = false;

	let plans = {
		monthly: true,
		yearly: false
	};

	const handlePro = () => {
		(plans.monthly = true), (plans.yearly = false);
	};
	const handleNonPro = () => {
		(plans.monthly = false), (plans.yearly = true);
	};

	const isSubscribed = both(
		complement(isNil),
		both(hasPath(['stripe', 'subscriptionId']), hasPath(['stripe', 'customerId']))
	);

	const isSubsRoute = equals(routes.subscriptions());
	const isAgreementSigned = ({ authstate: { agreement } }) => agreement || false;

	const handleSubmit = async ({ detail: { id, type } }) => {
		loading = true;
		if (equals(type, 'non_pro') && !isAgreementSigned($user)) {
			agreement = true;
			return;
		}
		const { url } = await fetch(routes.api.create_checkout_session(), {
			method: 'POST',
			body: JSON.stringify({
				type,
				price_id: id,
				uid: $user.uid,
				name: $user.displayName,
				email: $user.email,
				success_url: '/',
				cancel_url: '/subscription-error'
			})
		}).then((res) => res.json());
		window.open(url, '_blank');
		loading = false;
	};

	const handleAgreement = async ({ detail }) => {
		await firestore.setUserData($user.uid, {
			agreement: detail
		});
		agreement = false
	};

	onMount(async () => {
		$products = await fetch(routes.api.products_by_UID($user.uid))
			.then((res) => res.json())
			.then((products) => products.filter(({ price: { type } }) => !equals(type, 'one_time')));
	});
</script>

<svelte:head>
	<title>Subscriptions</title>
</svelte:head>
{#if agreement}
	<Agreement on:submit={handleAgreement} />
{:else}<div
		class="subscription-plans mt-4"
		class:monthly={plans.monthly}
		class:yearly={plans.yearly}
		id="subscription-plans"
	>
		<div class="title-area">
			<div class="h2">Select a plan</div>
			<p>Lorem ipsum dollar sit amit</p>
		</div>
		<div class="toggle-tab">
			<div class="tab" name="monthly" on:click={handlePro}>Pro</div>
			<div class="tab" name="yearly" on:click={handleNonPro}>Non Pro</div>
		</div>
		{#if $products.length}
			<div class="plans-list">
				<div class="monthly-plan">
					<div class="row">
						<div class="col-lg-2" />
						{#each $products as product}
							<div class="col-lg-4">
								<SubscriptionCard
									disabled={loading}
									interval="monthly"
									features={[
										'Lorem Ipsum Dollar Sit Amit',
										'Lorem Ipsum Dollar Sit Amit',
										'Lorem Ipsum Dollar Sit Amit'
									]}
									{...product}
									on:started={handleSubmit}
								/>
							</div>
						{/each}
						<div class="col-lg-2" />
					</div>
				</div>
				<div class="yearly-plan">
					<div class="row">
						<div class="col-lg-2" />
						{#each $products as product}
							<div class="col-lg-4">
								<SubscriptionCard
									trial
									disabled={loading}
									interval="monthly"
									features={[
										'Lorem Ipsum Dollar Sit Amit',
										'Lorem Ipsum Dollar Sit Amit',
										'Lorem Ipsum Dollar Sit Amit'
									]}
									{...product}
									on:started={handleSubmit}
									on:trial={handleSubmit}
								/>
							</div>
						{/each}
						<div class="col-lg-2" />
					</div>
				</div>
			</div>
		{:else}
			<div class="loader">
				<Wave size="30" color="#FF3E00" unit="px" duration="1s" />
			</div>
		{/if}
	</div>
{/if}

<style>
	.loader {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
	}
</style>
