#!/usr/bin/env node
// Audit Open Graph / Twitter card tags on every built blog post page.
//
// The standard (what Facebook, LINE and X need to show a large preview on first share):
//   - og:title, og:description, og:type=article, og:site_name, og:locale
//   - og:url equal to <link rel="canonical">
//   - og:image: absolute https://nutchanon.org URL to a PNG or JPEG in the build, at most 8 MB,
//     exactly 1200x630 (1.91:1), with og:image:width / og:image:height matching the file
//   - twitter:card=summary_large_image and twitter:image equal to og:image
//
// Usage (after `bun run build`):
//   node scripts/audit-og.mjs                    fail on any issue not in the baseline
//   node scripts/audit-og.mjs --update-baseline  record current issues as the baseline
//
// scripts/og-baseline.json lists issues that existed when the audit was added. They print as
// warnings so old posts can be fixed over time; new posts must pass in full.

import { readFileSync, writeFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const BUILD = 'build';
const SITE = 'https://nutchanon.org';
const BASELINE = 'scripts/og-baseline.json';
const WIDTH = 1200;
const HEIGHT = 630;
const MAX_BYTES = 8 * 1024 * 1024;

function pages() {
	const root = join(BUILD, 'blog');
	const out = [];
	for (const slug of readdirSync(root, { withFileTypes: true })) {
		if (!slug.isDirectory()) continue;
		const dir = join(root, slug.name);
		if (existsSync(join(dir, 'index.html'))) out.push(join(dir, 'index.html'));
		for (const sub of readdirSync(dir, { withFileTypes: true })) {
			const f = join(dir, sub.name, 'index.html');
			if (sub.isDirectory() && existsSync(f)) out.push(f);
		}
	}
	return out.sort();
}

function decode(s) {
	return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function metas(html) {
	const tags = {};
	for (const m of html.matchAll(/<meta\s+([^>]*?)\/?>/g)) {
		const attrs = Object.fromEntries([...m[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((a) => [a[1], decode(a[2])]));
		const key = attrs.property ?? attrs.name;
		if (key && attrs.content !== undefined && !(key in tags)) tags[key] = attrs.content;
	}
	const canon = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/);
	return { tags, canonical: canon ? decode(canon[1]) : undefined };
}

function imageSize(buf) {
	if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
		return { type: 'png', width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
	}
	if (buf[0] === 0xff && buf[1] === 0xd8) {
		let i = 2;
		while (i + 9 < buf.length) {
			if (buf[i] !== 0xff) { i++; continue; }
			const marker = buf[i + 1];
			const len = buf.readUInt16BE(i + 2);
			if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
				return { type: 'jpeg', height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
			}
			i += 2 + len;
		}
	}
	return null;
}

function audit(file) {
	const issues = [];
	const { tags, canonical } = metas(readFileSync(file, 'utf8'));
	const need = (key, code = `missing ${key}`) => {
		if (!tags[key] || !tags[key].trim()) issues.push(code);
		return tags[key];
	};
	need('og:title');
	need('og:description');
	if (need('og:type') && tags['og:type'] !== 'article') issues.push('og:type is not article');
	need('og:site_name');
	need('og:locale');
	if (need('og:url') && tags['og:url'] !== canonical) issues.push('og:url differs from canonical');
	if (tags['twitter:card'] !== 'summary_large_image') issues.push('twitter:card is not summary_large_image');

	const img = need('og:image');
	if (img) {
		if (tags['twitter:image'] !== img) issues.push('twitter:image differs from og:image');
		if (!img.startsWith(SITE + '/')) {
			issues.push('og:image is not an absolute nutchanon.org URL');
		} else {
			const path = join(BUILD, decodeURIComponent(img.slice(SITE.length)));
			if (!existsSync(path)) {
				issues.push('og:image file is not in the build');
			} else {
				const size = imageSize(readFileSync(path));
				if (!size) issues.push('og:image is not PNG or JPEG');
				else {
					if (size.width !== WIDTH || size.height !== HEIGHT) issues.push(`og:image is ${size.width}x${size.height}, not ${WIDTH}x${HEIGHT}`);
					const w = Number(tags['og:image:width']);
					const h = Number(tags['og:image:height']);
					if (!w || !h) issues.push('missing og:image:width/height');
					else if (w !== size.width || h !== size.height) issues.push('og:image:width/height do not match the file');
				}
				if (statSync(path).size > MAX_BYTES) issues.push('og:image is over 8 MB');
			}
		}
	}
	return issues;
}

const results = Object.fromEntries(pages().map((f) => [relative(BUILD, f), audit(f)]));

if (process.argv.includes('--update-baseline')) {
	const baseline = Object.fromEntries(Object.entries(results).filter(([, v]) => v.length));
	writeFileSync(BASELINE, JSON.stringify(baseline, null, '\t') + '\n');
	console.log(`Wrote ${BASELINE}: ${Object.keys(baseline).length} pages with known issues.`);
	process.exit(0);
}

const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : {};
let failed = 0;
let warned = 0;
for (const [page, issues] of Object.entries(results)) {
	const known = new Set(baseline[page] ?? []);
	for (const issue of issues) {
		if (known.has(issue)) {
			warned++;
			console.log(`::warning file=${page}::OG (baseline) ${issue}`);
		} else {
			failed++;
			console.log(`::error file=${page}::OG ${issue}`);
		}
	}
	for (const fixed of [...known].filter((k) => !issues.includes(k))) {
		console.log(`::notice file=${page}::OG fixed, remove from baseline: ${fixed}`);
	}
}
const total = Object.keys(results).length;
console.log(`\nOG audit: ${total} pages, ${failed} new issues, ${warned} baseline warnings.`);
process.exit(failed ? 1 : 0);
