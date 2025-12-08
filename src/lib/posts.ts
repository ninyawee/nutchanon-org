import type { BlogPost, BlogPostModule } from './types';

export async function getPosts(): Promise<BlogPost[]> {
	const modules = import.meta.glob<BlogPostModule>('/src/content/blog/*.svx', { eager: true });

	const posts: BlogPost[] = [];

	for (const path in modules) {
		const module = modules[path];
		const slug = path.split('/').pop()?.replace('.svx', '') ?? '';

		if (module.metadata.published) {
			posts.push({
				...module.metadata,
				slug
			});
		}
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
