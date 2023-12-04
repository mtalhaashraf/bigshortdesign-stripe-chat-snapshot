import { equals, includes, pipe, prop, __ } from 'ramda';
import {
	EmailAuthProvider,
	GithubAuthProvider,
	GoogleAuthProvider,
	TwitterAuthProvider
} from 'firebase/auth';

const isOneTimePrice = pipe(prop('type'), equals('one_time'));
const isRecurringPrice = pipe(prop('type'), equals('recurring'));

const FIREBASE_METHODS = [
	EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
	EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
	GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
	GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
	TwitterAuthProvider.TWITTER_SIGN_IN_METHOD
];

const isEmailProvider = includes(__, [
	EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
	EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD
]);

export { isOneTimePrice, isRecurringPrice, FIREBASE_METHODS, isEmailProvider };
