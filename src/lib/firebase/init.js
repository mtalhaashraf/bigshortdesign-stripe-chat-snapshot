import { getApps, getApp, initializeApp } from 'firebase/app';
import { setPersistence } from './auth';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID,
	PUBLIC_FIREBASE_STORAGE_BUCKET,
	PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	PUBLIC_FIREBASE_APP_ID
} from '$env/static/public';

import emulator from './emulator';
import { equals } from 'ramda';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: PUBLIC_FIREBASE_APP_ID
};

export default async (mode = 'production') => {
	try {
		console.log('Initializing firebase...');
		let app;
		const apps = getApps();
		if (!apps.length) {
			app = initializeApp(firebaseConfig);
		} else {
			app = getApp();
		}
		await setPersistence();
		if (equals(mode, 'test')) {
			emulator(app);
		}
		console.log('Firebase initialized');
	} catch (error) {
		console.log(error);
	}
};
