import { error } from '@sveltejs/kit';
import { type Lang, FALLBACK_LANG, LANGS, isLang, primaryLang } from '$lib/i18n';
import type { BlogPostModule } from '$lib/types';
import type { PageLoad } from './$types';

const modules = import.meta.glob<BlogPostModule>('/src/content/blog/**/*.svx');

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;
	const requested = params.lang; // optional path segment, undefined at the bare URL

	const folderLangs = LANGS.filter((l) => `/src/content/blog/${slug}/${l}.svx` in modules);
	const flatKey = `/src/content/blog/${slug}.svx`;

	if (folderLangs.length) {
		const primary = primaryLang(folderLangs);
		let lang: Lang;
		if (requested === undefined) {
			lang = primary;
		} else if (isLang(requested) && folderLangs.includes(requested) && requested !== primary) {
			// The primary language is canonical at the bare URL, so /<slug>/<primary> 404s to avoid duplicates.
			lang = requested;
		} else {
			throw error(404, `Post not found: ${slug} (${requested})`);
		}
		const module = await modules[`/src/content/blog/${slug}/${lang}.svx`]();
		return { content: module.default, meta: module.metadata, slug, lang, langs: folderLangs };
	}

	// Legacy single-file post: only the bare URL is valid.
	if (requested !== undefined || !(flatKey in modules)) {
		throw error(404, `Post not found: ${slug}`);
	}
	const module = await modules[flatKey]();
	const lang = isLang(module.metadata.lang ?? '') ? (module.metadata.lang as Lang) : FALLBACK_LANG;
	return { content: module.default, meta: module.metadata, slug, lang, langs: [lang] };
};
