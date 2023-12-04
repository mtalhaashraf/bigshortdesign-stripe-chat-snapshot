import { browserLocalPersistence, setPersistence, getAuth } from 'firebase/auth';

export default async () => {
	const auth = getAuth();
	await setPersistence(auth, browserLocalPersistence);
	console.log('Persistence Settled');
};
