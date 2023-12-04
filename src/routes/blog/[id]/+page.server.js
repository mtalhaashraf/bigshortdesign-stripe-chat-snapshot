import { getBlogs } from '$lib/firebaseAdmin';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const blogs = await getBlogs();

	return {
		blogs,
		blog: blogs.find((e) => e.id === params.id)
	};
}
