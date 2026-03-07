import { createHighlighter } from 'shiki';

const THEME = 'github-dark';

const LANGS = [
	'javascript',
	'typescript',
	'svelte',
	'html',
	'css',
	'bash',
	'json',
	'python',
	'diff',
	'yaml',
	'toml',
	'dockerfile',
	'markdown'
];

/** @type {ReturnType<typeof createHighlighter> | null} */
let highlighterPromise = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter({ themes: [THEME], langs: LANGS });
	}
	return highlighterPromise;
}

/**
 * Custom highlighter for mdsvex using shiki.
 * @param {string} code
 * @param {string | undefined} lang
 * @returns {Promise<string>}
 */
export async function highlighter(code, lang) {
	const shiki = await getHighlighter();
	const validLang = lang && LANGS.includes(lang) ? lang : 'text';

	const html = shiki.codeToHtml(code, {
		lang: validLang,
		theme: THEME
	});

	// mdsvex expects the raw HTML to replace the default <pre><code> block.
	// Wrap with {@html} escaping characters that mdsvex/svelte would interpret.
	const escaped = html
		.replace(/\{/g, '&#123;')
		.replace(/\}/g, '&#125;');

	return escaped;
}
