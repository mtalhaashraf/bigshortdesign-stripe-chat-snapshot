const cors = require('cors');
const functions = require('firebase-functions');
const { hasPath, equals, head, both, has, prop, add, isNil } = require('ramda');
const { db, admin } = require('./libs/firestore');
const { sendEmail } = require('./libs/postmark');

// const stripeObjectFormat = {
//   stripe: {
//     trial: false,
//     customerId: "",
//     subscriptionId: "",
//   },
// };

exports.webhook = functions.https.onRequest((req, res) =>
	cors()(req, res, async () => {
		try {
			if (hasPath(['data', 'object'])(req.body)) {
				const {
					type,
					data: { object }
				} = req.body;

				console.log(type, object);

				switch (type) {
					// Checkout
					case 'checkout.session.completed':
						const { mode, customer, subscription } = object;
						const users = await db
							.collection('users')
							.where('stripe.customerId', '==', `${customer}`)
							.get()
							.then(({ docs }) => {
								return docs.map((e) => ({ ...e.data(), uid: e.id }));
							});

						if (!head(users)) {
							throw 'User not found';
						}

						if (equals('payment')(mode) && users.length) {
							const { uid, stripe } = head(users);
							if (isNil(stripe) || !stripe.trial)
								await db.collection('users').doc(uid).update({
									'stripe.trial': true,
									userGroup: 'subscriber-non-pro'
								});
						} else if (equals('subscription')(mode) && users.length) {
							const { uid } = head(users);
							await db
								.collection('users')
								.doc(uid)
								.update({
									'stripe.subscriptionId': `${subscription}`,
									userGroup: 'subscriber-pro'
								});
						}
						break;
					// Customer
					case 'customer.created':
						const {
							metadata: { uid }
						} = object;

						if (uid)
							await db
								.collection('users')
								.doc(uid)
								.update({
									'stripe.customerId': `${object.id}`
								});

						break;
					case 'customer.deleted':
						const { id } = object;

						const usersArr = await db
							.collection('users')
							.where('stripe.customerId', '==', `${id}`)
							.get()
							.then(({ docs }) => {
								return docs.map((e) => ({ ...e.data(), uid: e.id }));
							});

						if (head(usersArr)) {
							const { uid } = head(usersArr);
							await db.collection('users').doc(uid).update({
								'stripe.customerId': admin.firestore.FieldValue.delete(),
								'stripe.subscriptionId': admin.firestore.FieldValue.delete(),
								userGroup: 'guest'
							});
						}

						break;
					// Subscription
					case 'customer.subscription.created':
						if (object) {
							const { id, customer } = object;

							const usersArr = await db
								.collection('users')
								.where('stripe.customerId', '==', customer)
								.get()
								.then(({ docs }) => {
									return docs.map((e) => ({ ...e.data(), uid: e.id }));
								});

							if (head(usersArr)) {
								const { uid, email } = head(usersArr);
								await db.collection('users').doc(uid).update({
									'stripe.subscriptionId': id
								});
								await sendEmail({
									from: 'andrewlim@hbcm.com',
									to: email,
									subject: 'Bigshort subscription created successfully',
									text: 'Thanks for being a subscriber'
								});
							}
						}

						break;
					case 'customer.subscription.deleted':
						if (object) {
							const { customer } = object;

							const usersArr = await db
								.collection('users')
								.where('stripe.customerId', '==', customer)
								.get()
								.then(({ docs }) => {
									return docs.map((e) => ({ ...e.data(), uid: e.id }));
								});

							if (head(usersArr)) {
								const { uid, email } = head(usersArr);
								await db.collection('users').doc(uid).update({
									'stripe.subscriptionId': admin.firestore.FieldValue.delete(),
									userGroup: 'guest'
								});
								await sendEmail({
									from: 'andrewlim@hbcm.com',
									to: email,
									subject: 'Bigshort subscription canceled',
									text: 'Subscription have been canceled'
								});
							}
						}
						break;
				}

				res.sendStatus(200);
			} else {
				res.sendStatus(400);
			}
		} catch (error) {
			console.log('***Error***', error);
			res.sendStatus(500);
		}
	})
);
