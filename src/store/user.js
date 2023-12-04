import { writable } from 'svelte/store';

export const initialvalue = {
	uid: null,
	email: null,
	metadata: null,
	photoURL: null,
	ipAddress: null,
	username: null,
	accessToken: null,
	displayName: null,
	emailVerified: false,
	authstate: {
		agreement: false,
		subscribed: false,
		otherDevice: false,
		authenticated: false,
		usernameExisted: false,
	},
	stripe: {
		trial: false,
		customerId: null,
		subscriptionId: null
	}
};

export const user = writable(Object.create(initialvalue));
