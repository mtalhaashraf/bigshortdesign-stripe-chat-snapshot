import { both, complement, equals, has, hasPath, isEmpty, pipe, prop, __ } from 'ramda';
import {
	getUserByUID,
	setAccessToken,
	setIpAddress,
	addUser,
	getAuthUserCredentials
} from '$lib/firebaseAdmin';
import { getSubscription } from '$lib/stripe';
import { getHandler, useError, useJSONResponse, useServerError } from '$lib/handlers/api';

export const GET = getHandler(__, async ({ url }) => {
	const uid = url.searchParams.get('uid');
	const accessToken = url.searchParams.get('accessToken');
	const ipAddress = url.searchParams.get('ipAddress');

	let accessTokenMatched = false;
	let ipAddressMatched = false;
	//
	let authstate = {
		subscribed: false,
		authenticated: false,
		usernameExisted: false,
		otherDevice: false
	};

	if (!uid || !accessToken || !ipAddress) {
		return useError(402, 'Invalid arguments');
	}

	const user = await getUserByUID(uid);

	if (!user) {
		const { email, emailVerified, displayName, photoURL } = await getAuthUserCredentials(uid);
		await addUser(uid, { email, emailVerified, displayName, photoURL, ipAddress, accessToken });
		return useJSONResponse(200, {
			...authstate,
			authenticated: true,
			otherDevice: false
		});
	}

	if (both(has('username'), pipe(prop('username'), complement(isEmpty)))(user)) {
		authstate.usernameExisted = true;
	}

	if (has('stripe')(user)) {
		if (hasPath(['stripe', 'subscriptionId'])(user)) {
			const subscription = await getSubscription(user.stripe.subscriptionId);
			console.log(subscription);
			authstate.subscribed = true;
		}
	}

	if (!user.accessToken || !user.ipAddress) {
		await setAccessToken(uid, accessToken);
		await setIpAddress(uid, ipAddress);
		return useJSONResponse(200, {
			...authstate,
			authenticated: true,
			otherDevice: false
		});
	} else {
		if (equals(accessToken, user.accessToken)) {
			accessTokenMatched = true;
		}

		if (equals(ipAddress, user.ipAddress)) {
			ipAddressMatched = true;
		}

		if (accessTokenMatched && ipAddressMatched) {
			return useJSONResponse(200, {
				...authstate,
				authenticated: true,
				otherDevice: false
			});
		} else if (!accessTokenMatched && ipAddressMatched) {
			await setAccessToken(uid, accessToken);

			return useJSONResponse(200, {
				...authstate,
				authenticated: true,
				otherDevice: false
			});
		} else if (accessTokenMatched && !ipAddressMatched) {
			// Exceptional case
			return useServerError('Exceptional case');
		} else {
			return useJSONResponse(200, {
				...authstate,
				authenticated: false,
				otherDevice: true
			});
		}
	}
});
