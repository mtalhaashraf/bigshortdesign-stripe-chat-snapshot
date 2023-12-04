import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

export default (app) => {
	const auth = getAuth(app);
	const firestore = getFirestore(app);
	const functions = getFunctions(app);
	connectAuthEmulator(auth);
	connectFirestoreEmulator(firestore);
	connectFunctionsEmulator(functions);
};
