import {
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	setDoc,
	updateDoc,
	where,
	onSnapshot
} from 'firebase/firestore';

const addOrUpdateUser = async (uid, data) => {
	const db = getFirestore();
	const userRef = doc(db, 'users', uid);
	const userSnap = await getDoc(userRef);
	if (userSnap.exists()) {
		await updateDoc(userRef, pick(['metadata', 'accessToken', 'ip_address'], data));
	} else {
		await setDoc(doc(db, 'users', uid), data);
	}
};

const getUser = async (uid) => {
	const db = getFirestore();
	const userRef = doc(db, 'users', uid);
	const snap = await getDoc(userRef);

	return snap.data();
};

const getUsersByEmail = async (email) => {
	const db = getFirestore();
	try {
		const q = query(collection(db, 'users'), where('email', '==', email));

		const querySnapshot = await getDocs(q);

		let users = [];
		querySnapshot.forEach((doc) => {
			users.push({ ...doc.data(), uid: doc.id });
		});
		console.log(users);
		return users;
	} catch (error) {
		console.log(error);
		return null;
	}
};

const getAccessToken = async (email) => {
	const db = getFirestore();
	try {
		const users = await getUsersByEmail(email);
		console.log(users);
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

const getUserData = async (uid) => {
	const db = getFirestore();
	const userRef = doc(db, 'users', uid);
	const snap = await getDoc(userRef);

	return snap.data();
};

const setUserData = async (uid, data) => {
	try {
		const db = getFirestore();
		await setDoc(doc(db, 'users', uid), data, { merge: true });
	} catch (error) {
		console.log(error);
	}
};

const getUserSnap = (uid, callback) => {
	const db = getFirestore();
	const unsub = onSnapshot(doc(db, 'users', uid), (doc) => {
		callback(doc);
	});
	return unsub;
};

export { setUserData, getUserData, getUserSnap };
