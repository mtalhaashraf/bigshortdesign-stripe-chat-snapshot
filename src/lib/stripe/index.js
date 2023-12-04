import { equals, filter, pipe, prop } from 'ramda';
import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

const stripeClient = new Stripe(STRIPE_SECRET_KEY);

const getAllProducts = async () => {
	try {
		const products = await stripeClient.products.list().then((res) => res.data);
		return products;
	} catch (error) {
		return [];
	}
};

const getAllPrices = async () => {
	try {
		const prices = await stripeClient.prices.list().then((res) => res.data);
		return prices;
	} catch (error) {
		return [];
	}
};

const createCheckoutSession = async ({ trial, prices, success_url, cancel_url, customer_id }) => {
	const session = await stripeClient.checkout.sessions.create({
		mode: 'subscription',
		line_items: [...prices],
		customer: customer_id,
		success_url: success_url,
		cancel_url: cancel_url,
		...(trial && {
			subscription_data: {
				trial_period_days: trial
			}
		})
	});

	return session.url;
};

const createCustomer = async ({ email, name, metadata }) => {
	const customer = await stripeClient.customers.create({
		email,
		name,
		metadata
	});

	return customer.id;
};

const getCustmers = async (query) => {
	try {
		const customers = await stripeClient.customers.search({
			query
		});
		return customers;
	} catch (error) {
		return [];
	}
};

const getPrice = async (id) => {
	try {
		if (id) {
			const price = await stripeClient.prices.retrieve(id);
			return price;
		}
		return null;
	} catch (error) {
		return null;
	}
};

const getProduct = async (id) => {
	try {
		if (id) {
			const product = await stripeClient.products.retrieve(id);
			return product;
		}
		return null;
	} catch (error) {
		return null;
	}
};

const constructWebhookEvent = (data, signature, secret) => {
	try {
		const event = stripeClient.webhooks.constructEvent(data, signature, secret);
		return event;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const getAllSubscription = async () => {
	try {
		const subscriptions = await stripeClient.subscriptions.list();
		return subscriptions;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const getSubscriptionsByCustomerId = async (id) => {
	try {
		const subscriptions = await getAllSubscription();
		if (subscriptions) {
			return filter(pipe(prop('customer'), equals(id)))(subscriptions);
		}

		return null;
	} catch (error) {
		console.log(err);
		return null;
	}
};

const getPortalURL = async (customer_id, return_url) => {
	try {
		const session = await stripeClient.billingPortal.sessions.create({
			customer: customer_id,
			return_url
		});
		return session.url;
	} catch (err) {
		console.log(err);
		return null;
	}
};

const getSubscription = async (id) => {
	try {
		const subscription = await stripeClient.subscriptions.retrieve(id);
		return subscription;
	} catch (error) {
		console.log(err);
		return null;
	}
};

export {
	getAllProducts,
	getAllPrices,
	getAllSubscription,
	getPrice,
	getProduct,
	constructWebhookEvent,
	createCheckoutSession,
	createCustomer,
	getCustmers,
	getSubscriptionsByCustomerId,
	getPortalURL,
	getSubscription
};
