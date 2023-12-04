import { getBlogs } from '$lib/firebaseAdmin';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const blogs = await getBlogs();

	return {
		blogs
	};
}
