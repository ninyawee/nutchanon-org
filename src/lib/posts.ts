import type { BlogPost, BlogPostMeta, BlogPostModule } from './types';
import { type Lang, FALLBACK_LANG, isLang, primaryLang } from './i18n';

/**
 * Discover every translation of every post, grouped by slug. Two layouts are
 * supported: legacy flat `<slug>.svx` (single language) and folder-per-post
 * `<slug>/<lang>.svx` (one file per language).
 */
function loadVariants(): Map<string, Map<Lang, BlogPostMeta>> {
	const flat = import.meta.glob<BlogPostModule>('/src/content/blog/*.svx', { eager: true });
	const folder = import.meta.glob<BlogPostModule>('/src/content/blog/*/*.svx', { eager: true });
	const bySlug = new Map<string, Map<Lang, BlogPostMeta>>();

	const add = (slug: string, lang: Lang, metadata: BlogPostMeta) => {
		const langs = bySlug.get(slug) ?? new Map<Lang, BlogPostMeta>();
		langs.set(lang, metadata);
		bySlug.set(slug, langs);
	};

	for (const path in flat) {
		const slug = path.split('/').pop()!.replace('.svx', '');
		const { metadata } = flat[path];
		add(slug, metadata.lang ?? FALLBACK_LANG, metadata);
	}

	for (const path in folder) {
		const parts = path.split('/');
		const lang = parts.pop()!.replace('.svx', '');
		const slug = parts.pop()!;
		if (!isLang(lang)) continue;
		add(slug, lang, folder[path].metadata);
	}

	return bySlug;
}

/** One published entry per slug, in the post's primary language, newest first. */
export async function getPosts(): Promise<BlogPost[]> {
	const posts: BlogPost[] = [];

	for (const [slug, byLang] of loadVariants()) {
		const langs = [...byLang.keys()];
		const lang = primaryLang(langs);
		const metadata = byLang.get(lang)!;
		if (!metadata.published) continue;
		posts.push({ ...metadata, slug, lang, langs });
	}

	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
