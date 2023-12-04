import { getSubscription } from '$lib/stripe';
import { __ } from 'ramda';
import { getHandler as errorHandler } from '$lib/handlers/api';

export const GET = errorHandler(__, async ({ params }) => {
	const id = params.id;

	const subscription = await getSubscription(id);

	if (subscription) {
		return {
			status: 200,
			body: {
				subscription
			}
		};
	}

	return {
		status: 401
	};
});
