import { getUserByUID } from '$lib/firebaseAdmin';
import { getAllPrices, getAllProducts, getSubscriptionsByCustomerId } from '$lib/stripe';
import {
	assoc,
	assocPath,
	both,
	equals,
	evolve,
	find,
	has,
	hasPath,
	head,
	identity,
	map,
	pick,
	pipe,
	prop,
	propEq,
	__
} from 'ramda';
import { getHandler as errorHandler, useJSONResponse, useError } from '$lib/handlers/api';

export const GET = errorHandler(__, async ({ params }) => {
	const uid = params.uid;
	const user = await getUserByUID(uid);

	if (user) {
		const { stripe } = user;
		const isPaidTrialNotUsed = !stripe || !stripe?.trial;

		const allProducts = await getAllProducts();
		const prices = await getAllPrices();
		let subs = [];

		if (hasPath(['stripe', 'customerId'])(user)) {
			const { data } = await getSubscriptionsByCustomerId();

			const transform = {
				id: identity,
				status: identity,
				items: pipe(prop(['data']), head, prop('price'))
			};

			if (data) {
				subs = map(pipe(pick(['id', 'status', 'items']), evolve(transform)))(data);
			}
		}

		const attachPrice = (product) => {
			const price = find(propEq('product', product.id))(prices);

			const isOneTime = equals('one_time');

			if (price) {
				if (isOneTime(price.type)) {
					return pipe(
						assoc('used', !isPaidTrialNotUsed),
						assocPath(['price', 'id'], price.id),
						assocPath(['price', 'type'], price.type),
						assocPath(['price', 'unit_amount'], price.unit_amount),
						assocPath(['price', 'currency'], price.currency)
					)(product);
				}

				return pipe(
					assoc('used', false),
					assocPath(['price', 'id'], price.id),
					assocPath(['price', 'type'], price.type),
					assocPath(['price', 'unit_amount'], price.unit_amount),
					assocPath(['price', 'currency'], price.currency)
				)(product);
			}
			return product;
		};

		const pricedProducts = map(
			pipe(attachPrice, pick(['id', 'name', 'description', 'price', 'used'])),
			allProducts
		);

		return useJSONResponse(200, pricedProducts);
	} else {
		return useError(400, 'user id required');
	}
});
