import { updatePassword, getAuth } from 'firebase/auth';

export default (password) => {
	const auth = getAuth();
	return updatePassword(auth.currentUser, password);
};
