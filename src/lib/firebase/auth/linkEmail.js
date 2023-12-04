import { EmailAuthProvider, getAuth, linkWithCredential } from 'firebase/auth';

const linkEmailPassword = (email, password) => {
	const auth = getAuth();
	const credential = EmailAuthProvider.credential(email, password);
	return linkWithCredential(auth.currentUser, credential);
};

const linkEmailLink = (email, link) => {
	const auth = getAuth();
	const credential = EmailAuthProvider.credentialWithLink(email, link);
	return linkWithCredential(auth.currentUser, credential);
};

export { linkEmailLink, linkEmailPassword };
