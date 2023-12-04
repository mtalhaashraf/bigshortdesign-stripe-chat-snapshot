import { getPortalURL } from '$lib/stripe';
import { postHandler, useError, useJSONResponse } from '$lib/handlers/api';

import { __ } from 'ramda';
import { postHandler as errorHandler } from '$lib/handlers/api';

export const POST = errorHandler(__, async ({ data, url }) => {
	const { customer_id, return_url } = data;

	const link = await getPortalURL(customer_id, `${url.origin}${return_url}`);

	if (link) return useJSONResponse(200, { url: link });
	return useError(400, 'Unidentified User');
});
