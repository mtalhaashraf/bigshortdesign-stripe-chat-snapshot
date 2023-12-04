<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let disabled = false;
	export let trial = false;
	export let name = '';
	export let price = {
		id: '',
		unit_amount: '',
		currency: ''
	};
	export let description = '';
	export let features = [];

	const handleBuy = () => {
		dispatch('started', { id: price.id, type: trial ? 'non_pro' : 'pro' });
	};

	const handleTrial = () => {
		dispatch('trial', { id: price.id, type: trial ? 'non_pro' : 'pro' });
	};

	const formattedPrice = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: price.currency,
		notation: 'compact'
	}).format(price.unit_amount / 100);
</script>

<div class="plan">
	<div class="title">{name}</div>
	<div class="price">{formattedPrice}</div>
	<div class="sub-detail">
		{description}
	</div>
	<div class="feature-list">
		<ul class="flex flex-col items-center">
			{#each features as feature}
				<li>{feature}</li>
			{/each}
		</ul>
	</div>
	<div class="button-block">
		{#if trial}
			<button {disabled} on:click={handleTrial} class="btn outline-btn">Start 7 days trial</button>
		{/if}
		<button {disabled} on:click={handleBuy} class="btn primary-btn">Get Started</button>
	</div>
</div>
