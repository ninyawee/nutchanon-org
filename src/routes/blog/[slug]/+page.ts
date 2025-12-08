import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const post = await import(`../../../content/blog/${params.slug}.svx`);

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch {
		throw error(404, `Post not found: ${params.slug}`);
	}
};
