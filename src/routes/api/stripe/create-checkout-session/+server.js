import { getUserByUID } from '$lib/firebaseAdmin';
import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';
import {
	createCheckoutSession,
	createCustomer,
	getAllProducts,
	getCustmers,
	getPrice
} from '$lib/stripe';
import { assoc, equals, find, hasPath, head, pipe, __ } from 'ramda';

import { isRecurringPrice } from '$lib/utils';

const createPriceObject = (id, quantity) =>
	pipe(assoc('price', id), assoc('quantity', quantity))({});

export const POST = postHandler(__, async ({ data, url }) => {
	const { type, price_id, email, name, success_url, cancel_url, uid } = data;

	const user = await getUserByUID(uid);
	const price = await getPrice(price_id);

	if (!user) {
		return useError(400, 'User not exist');
	} else if (hasPath(['stripe', 'subscriptionId'])(user)) {
		return useError(400, 'Subscription already exist');
	}

	if (!price) {
		return useError(400, 'Product not exist');
	}

	const products = await getAllProducts();

	const defaultProduct = find(pipe(hasPath(['metadata', 'default'])))(products);
	const paidProduct = find(pipe(hasPath(['metadata', 'trial'])))(products);

	if (
		!defaultProduct ||
		!defaultProduct.default_price ||
		!paidProduct ||
		!paidProduct.default_price
	) {
		return useError(500, 'No default or paid product exist');
	}

	const isPaidTrial = hasPath(['stripe', 'trial'])(user) && user.stripe.trial;

	const existingCustomers = await getCustmers(
		`email:\'${email}\' AND metadata[\'uid\']:\'${uid}\'`
	);
	const exitingCustomer = head(existingCustomers.data);

	let customer_id;
	let prices = [];

	if (exitingCustomer) {
		customer_id = exitingCustomer.id;
	} else customer_id = await createCustomer({ email, name, metadata: { uid } });

	let responseUrl;

	if (!isRecurringPrice(price)) {
		return useError(400, 'Invalid product');
	}

	if (equals(type, 'pro')) {
		prices.push(createPriceObject(price_id, 1));
		responseUrl = await createCheckoutSession({
			email,
			prices,
			success_url: `${url.origin}${success_url}`,
			cancel_url: `${url.origin}${cancel_url}`,
			customer_id: customer_id
		});
	} else if (equals(type, 'non_pro')) {
		if (!isPaidTrial) {
			prices.push(createPriceObject(price_id, 1));
			prices.push(createPriceObject(paidProduct.default_price, 1));
			responseUrl = await createCheckoutSession({
				email,
				prices,
				success_url: `${url.origin}${success_url}`,
				cancel_url: `${url.origin}${cancel_url}`,
				customer_id: customer_id,
				trial: 7
			});
		} else {
			prices.push(createPriceObject(price_id, 1));
			responseUrl = await createCheckoutSession({
				email,
				prices,
				success_url: `${url.origin}${success_url}`,
				cancel_url: `${url.origin}${cancel_url}`,
				customer_id: customer_id
			});
		}
	} else {
		return useError(400, 'Unidentified User');
	}

	return useJSONResponse(200, {
		url: responseUrl
	});
});
