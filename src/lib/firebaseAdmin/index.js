import admin from 'firebase-admin';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { hasPath, head } from 'ramda';
import service_acount from './service_account';

const apps = getApps();

if (!apps.length) {
	initializeApp({
		credential: admin.credential.cert(service_acount)
	});
}

const auth = getAuth();
const firestore = getFirestore();

const getAuthUserCredentials = async (uid) => {
	const credentials = await auth.getUser(uid);
	return credentials;
};

const addUser = async (uid, data) => {
	await firestore.collection('users').doc(uid).set(data, { merge: true });
};

const addCustomerIdToUser = async (customer_id, uid) => {
	await firestore.collection('users').doc(uid).update({
		stripe: {
			customer_id
		}
	});
};

const getUsersByCustomerId = async (customer_id) => {
	try {
		const users = await firestore
			.collection('users')
			.where('stripe.customer_id', '==', customer_id)
			.get()
			.then((snap) => {
				let docs = [];
				snap.forEach((doc) => docs.push({ ...doc.data(), uid: doc.id }));
				return docs;
			});
		return users;
	} catch (error) {
		return null;
	}
};

const updateUser = async (uid, data) => {
	await firestore.collection('users').doc(uid).update(data);
};

const getUserByUID = async (uid) => {
	try {
		const user = await firestore
			.collection('users')
			.doc(uid)
			.get()
			.then((doc) => {
				if (doc.exists) {
					return doc.data();
				}
				return null;
			});
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getUsersByEmail = async (email) => {
	try {
		const querySnapshot = await firestore.collection('users').where('email', '==', email).get();
		console.log(querySnapshot.size);
		let users = [];
		querySnapshot.forEach((doc) => {
			users.push({ ...doc.data(), uid: doc.id });
		});
		return users;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const setAccessToken = async (uid, accessToken) => {
	try {
		await firestore.collection('users').doc(uid).set({ accessToken }, { merge: true });
	} catch (error) {
		console.log(error);
	}
};

const setIpAddress = async (uid, ipAddress) => {
	try {
		await firestore.collection('users').doc(uid).set({ ipAddress }, { merge: true });
	} catch (error) {
		console.log(error);
	}
};

const getAccessToken = async (email) => {
	try {
		const users = await getUsersByEmail(email);
		if (users && users.length) {
			const user = head(users);

			if (hasPath(['provider_data', 'accessToken'])(user)) {
				return user.provider_data.accessToken;
			}

			return null;
		}
		return null;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const isUsernameExist = async (username) => {
	try {
		const querySnapshot = await firestore
			.collection('users')
			.where('username', '==', username)
			.get();
		if (querySnapshot.size > 0) {
			return true;
		}
		return false;
	} catch (error) {
		console.log(error);
		return false;
	}
};

const setUsername = async (uid, username) => {
	try {
		await firestore.collection('users').doc(uid).set({ username }, { merge: true });
	} catch (error) {
		console.log(error);
	}
};

const getBlogs = async () => {
	const blogsRef = firestore.collection('blogs');
	const blogs = await blogsRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return blogs;
};

const getUserData = (id) => {
	return firestore.collection('users').doc(id).get();
};

const getBlogByID = (id) => {
	return firestore.collection('blogs').doc(id).get();
};

const getAnnouncements = async () => {
	const announcementsRef = firestore.collection('announcements');
	const announcements = await announcementsRef
		.get()
		.then((snapshot) => snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
		.catch((err) => {
			console.log(err);
			return [];
		});

	return announcements;
};

export {
	addCustomerIdToUser,
	getUsersByCustomerId,
	updateUser,
	getAccessToken,
	setUsername,
	isUsernameExist,
	//
	getUserByUID,
	setAccessToken,
	setIpAddress,
	addUser,
	getAuthUserCredentials,
	//
	getBlogs,
	getBlogByID,
	getUserData,
	//
	getAnnouncements
};
