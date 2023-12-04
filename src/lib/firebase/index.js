import { browser } from '$app/env';
import * as auth from './auth';
import * as firestore from './firestore';
import init from './init';

browser && init()

const reportUserHandler = async (data) => {
	try {
		let newReport = await addDoc(collection(db, 'reports'), {
			userEmail: data.userEmail,
			reportedUser: data.reportedUser,
			message: data.message
		});

		if (!newReport) {
			return {
				status: false,
				message: 'Failed to add report !!',
				data: []
			};
		} else {
			return {
				status: true,
				message: 'Report filed !!',
				data: newReport
			};
		}
	} catch (error) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log('error occured in adding data in firebase : ', error);
		// ..
		alert(errorMessage);
	}
};

//report user handler ends

const getUserDocs = async () => {
	try {
		let usersQuery = query(collection(db, 'users'));

		let snapshot = await getDocs(usersQuery);
		let emails = [];

		snapshot.forEach((doc) => {
			emails.push({ username: doc.data().username, email: doc.data().email });
		});

		return emails;
	} catch (error) {
		console.log('error occured :: ', error);
	}
};

const updateUserRole = async (data) => {
	try {
		let uid = '';
		let res;

		const q = query(collection(db, 'users'), where('username', '==', data.username));
		let getUserDetails = await getDocs(q);

		getUserDetails.forEach((doc) => {
			uid = doc.id;
		});

		const userRef = doc(db, 'users', uid);
		const snap = await getDoc(userRef);

		if (snap.exists()) {
			res = await updateDoc(userRef, { role: data.role });
			return res;
		} else {
			return {
				message: 'user does not exists!'
			};
		}
	} catch (error) {
		console.log('error occured !! ', error);
	}
};

const getUsername = async (data) => {
	try {
		let usersQuery = query(collection(db, 'users'));
		let snapShot = await getDocs(usersQuery);
		let username = '';
		let role = '';

		snapShot.forEach((doc) => {
			if (doc.data().email == data.email) {
				role = doc.data().role;
				username = doc.data().username;
			} else {
				return;
			}
		});

		return {
			username: username,
			role: role
		};
	} catch (error) {
		console.log('error occured while getting user name :: ', error);
	}
};
// others

const setUsername = async (uid, data) => {
	await setDoc(doc(db, 'users', uid), data, { merge: true });
};

const userMutes = async (data) => {
	try {
		let uid = '';
		let res;

		const q = query(collection(db, 'users'), where('email', '==', data.email));
		let getUserDetails = await getDocs(q);

		getUserDetails.forEach((doc) => {
			uid = doc.id;
		});

		const userRef = doc(db, 'users', uid);
		const snap = await getDoc(userRef);

		if (snap) {
			res = await setDoc(userRef, { mutedUsers: data.mutes }, { merge: true });
			return res;
		} else {
			return {
				message: 'User not found!!'
			};
		}
	} catch (error) {
		console.log('error occured !! ', error);
	}
};

export {
	auth,
	firestore,
	reportUserHandler,
	getUserDocs,
	updateUserRole,
	getUsername,
	setUsername,
	userMutes
};
