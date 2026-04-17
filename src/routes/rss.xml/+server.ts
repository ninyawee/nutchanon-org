import { getPosts } from '$lib/posts';

const SITE_URL = 'https://nutchanon.org';
const SITE_TITLE = 'Nutchanon';
const SITE_DESCRIPTION = 'Personal website and blog of Nutchanon Ninyawee.';

export const prerender = true;

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

export async function GET() {
	const posts = await getPosts();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/blog/${post.slug}`;
			const pubDate = new Date(post.date).toUTCString();
			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${pubDate}</pubDate>
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(SITE_TITLE)}</title>
		<link>${SITE_URL}</link>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
		<language>en</language>${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
