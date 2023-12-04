import setPersistence from './setPersistence';
import * as providers from './getProviderMethods';
import * as link from './linkEmail';
import updateUserPassword from './updateUserPassword';
import {
	getAuth,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithEmailLink,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
	signOut
} from 'firebase/auth';

const subscribeStateChangedObserver = (nextOrObserver) => {
	const auth = getAuth();
	return onAuthStateChanged(auth, nextOrObserver);
};

const getLoggedInUser = () => {
	const auth = getAuth();
	return auth.currentUser;
};

const isLoggedIn = () => {
	const auth = getAuth();
	if (auth.currentUser) return true;
	return false;
};

const getMethodsByEmail = async (email) => {
	try {
		const auth = getAuth();
		const methods = await fetchSignInMethodsForEmail(auth, email);
		return methods;
	} catch (error) {
		return null;
	}
};

const signUp = (email, password) => {
	const auth = getAuth();
	return createUserWithEmailAndPassword(auth, email, password);
};

const login = (email, password) => {
	const auth = getAuth();
	return signInWithEmailAndPassword(auth, email, password);
};

const signInWithLink = (email, url) => {
	const auth = getAuth();
	return signInWithEmailLink(auth, email, url);
};

const sendLinkToEmail = (email, actionCodeSettings) => {
	const auth = getAuth();
	return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

const isEmailLink = (url) => {
	const auth = getAuth();
	return isSignInWithEmailLink(auth, url);
};

const logout = () => {
	const auth = getAuth();
	return signOut(auth);
};

export {
	signUp,
	login,
	signInWithLink,
	sendLinkToEmail,
	isEmailLink,
	isLoggedIn,
	getLoggedInUser,
	getMethodsByEmail,
	subscribeStateChangedObserver,
	logout,
	updateUserPassword,
	providers,
	link,
	setPersistence
};
