export const LANGS = ['en', 'th'] as const;
export type Lang = (typeof LANGS)[number];

/** Site-wide preference: when a post has multiple translations, this is the one served at the bare URL. */
export const DEFAULT_LANG: Lang = 'th';

/** Fallback for legacy single-file posts that don't declare a language. */
export const FALLBACK_LANG: Lang = 'en';

export const LANG_LABELS: Record<Lang, string> = {
	en: 'EN',
	th: 'TH'
};

export function isLang(value: string): value is Lang {
	return (LANGS as readonly string[]).includes(value);
}

/** The canonical language for a post given which translations exist. */
export function primaryLang(available: readonly Lang[]): Lang {
	return available.includes(DEFAULT_LANG) ? DEFAULT_LANG : available[0];
}

/**
 * URL for a post in a given language. The primary language lives at the bare
 * `/blog/<slug>`; other languages get an explicit `/blog/<slug>/<lang>` suffix.
 * This keeps one canonical URL per language with no duplicate-content pages.
 */
export function postPath(slug: string, lang: Lang, available: readonly Lang[]): string {
	return lang === primaryLang(available) ? `/blog/${slug}` : `/blog/${slug}/${lang}`;
}
