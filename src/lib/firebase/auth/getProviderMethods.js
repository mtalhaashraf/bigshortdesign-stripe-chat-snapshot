import {
	FacebookAuthProvider,
	GithubAuthProvider,
	GoogleAuthProvider,
	TwitterAuthProvider,
	//
	signInWithPopup,
	signInWithRedirect,
	//
	linkWithPopup,
	getAuth
} from 'firebase/auth';
import { equals } from 'ramda';
import { PUBLIC_AUTH_MODE } from '$env/static/public';

const authMode = PUBLIC_AUTH_MODE;

const google = new GoogleAuthProvider();
const facebook = new FacebookAuthProvider();
const twitter = new TwitterAuthProvider();
const github = new GithubAuthProvider();

const getProvider = (providerId) => {
	switch (providerId) {
		case 'google.com':
			return google;
		case 'github.com':
			return github;
		case 'twitter.com':
			return twitter;
		case 'facebook.com':
			return facebook;
	}
	return null;
};

const linkProvider = (providerId) => {
	const auth = getAuth();
	const provider = getProvider(providerId);
	if (provider) return linkWithPopup(auth.currentUser, provider);
	return null;
};

const signInWithGoogle = () => {
	const auth = getAuth();
	if (equals(authMode, 'redirect')) {
		return signInWithRedirect(auth, google);
	} else {
		return signInWithPopup(auth, google);
	}
};
const signInWithGithub = () => {
	const auth = getAuth();
	if (equals(authMode, 'redirect')) {
		return signInWithRedirect(auth, github);
	} else {
		return signInWithPopup(auth, github);
	}
};
const signInWithFacebook = () => {
	const auth = getAuth();
	if (equals(authMode, 'redirect')) {
		return signInWithRedirect(auth, facebook);
	} else {
		return signInWithPopup(auth, facebook);
	}
};
const signInWithTwitter = () => {
	const auth = getAuth();
	if (equals(authMode, 'redirect')) {
		return signInWithRedirect(auth, twitter);
	} else {
		return signInWithPopup(auth, twitter);
	}
};

export { signInWithFacebook, signInWithGithub, signInWithGoogle, signInWithTwitter, linkProvider };
