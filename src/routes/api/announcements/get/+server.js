import { getHandler, useJSONResponse } from '$lib/handlers/api';

import { getAnnouncements } from '$lib/firebaseAdmin';
import { __ } from 'ramda';

export const GET = getHandler(__, async () => {
	const announcements = await getAnnouncements();
	return useJSONResponse(200, {
		announcements
	});
});
