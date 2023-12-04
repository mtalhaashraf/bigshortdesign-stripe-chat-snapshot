export default {
	home: () => '/',
	login: () => '/login',
	forget_password: () => '/forget-password',
	reset_password: () => '/reset-password',
	signup: () => '/signup',
	subscriptions: () => '/subscriptions',
	blogByID: (id) => `/blog/${id}`,
	chat: () => '/chat',

	api: {
		login: () => '/api/login',
		create_checkout_session: () => '/api/stripe/create-checkout-session',
		create_customer_portal_session: () => '/api/stripe/create-customer-portal-session',
		products_by_UID: (uid) => `/api/stripe/products/${uid}`,
		products_by_UID: (uid) => `/api/stripe/products/${uid}`,
		get_subscription: (id) => `/api/stripe/subscription/${id}`
	}
};

const authRoutes = ['/subscriptions', '/providers', '/portal', '/chat'];

const noAuthRoutes = ['/login', '/signup', '/forget-password'];

const SECRET = 'LKNSDFB9845G89';

export { authRoutes, noAuthRoutes, SECRET };
