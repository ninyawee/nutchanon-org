import { test, expect } from '@playwright/test';

const SLUG = '/blog/agentic-gis-spatial-formats/';

test.describe('Blog: Agentic GIS Spatial Formats - Smoke Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(SLUG);
	});

	test('page loads and title renders', async ({ page }) => {
		await expect(page).toHaveTitle(/700x Compression/);
		await expect(page.locator('h1')).toContainText(
			'700x Compression: Finding the Best Spatial Format for AI Map Agents'
		);
	});

	test('OG meta tags are present', async ({ page }) => {
		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute('content', /700x Compression/);

		const ogDesc = page.locator('meta[property="og:description"]');
		await expect(ogDesc).toHaveAttribute('content', /spatial/i);

		const ogImage = page.locator('meta[property="og:image"]');
		await expect(ogImage).toHaveAttribute(
			'content',
			/\/blog\/agentic-gis-spatial-formats\/og\.png$/
		);

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute('content', 'article');

		const twitterCard = page.locator('meta[name="twitter:card"]');
		await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
	});

	test('images load successfully', async ({ page }) => {
		const images = page.locator('.content img');
		const count = await images.count();
		expect(count).toBeGreaterThanOrEqual(2);

		for (let i = 0; i < count; i++) {
			const img = images.nth(i);
			await expect(img).toBeVisible();
			const naturalWidth = await img.evaluate(
				(el: HTMLImageElement) => el.naturalWidth
			);
			expect(naturalWidth).toBeGreaterThan(0);
		}
	});

	test('interactive components mount', async ({ page }) => {
		// TokenCounter component
		const tokenCounter = page.locator('.token-counter, [class*="token"]').first();
		await expect(tokenCounter).toBeVisible({ timeout: 10000 });

		// CompressionFunnel component
		const funnel = page.locator('.compression-funnel, [class*="funnel"]').first();
		await expect(funnel).toBeVisible({ timeout: 10000 });

		// BenchmarkChart component
		const chart = page.locator('.benchmark-chart, [class*="benchmark"]').first();
		await expect(chart).toBeVisible({ timeout: 10000 });
	});

	test('all section headings render', async ({ page }) => {
		const expectedHeadings = [
			'Three Kinds of GIS Agent',
			'The Setup',
			'Step 1: Raw GeoJSON Is Terrible',
			'Step 2: Clip to Viewport',
			'Step 3: H3 Hexagonal Indexing',
			'Step 4: Natural Language Description',
			'Step 5: Compact Grid Notation',
			'Step 6: Raycast (The Winner)',
			'The Benchmark',
			'What I Learned',
			'The Recommended Stack',
			'Real-World Use Cases'
		];

		for (const heading of expectedHeadings) {
			await expect(
				page.locator('h2, h3').filter({ hasText: heading }).first()
			).toBeVisible();
		}
	});

	test('code blocks render with syntax highlighting', async ({ page }) => {
		const codeBlocks = page.locator('pre.shiki, pre code');
		const count = await codeBlocks.count();
		expect(count).toBeGreaterThanOrEqual(3);
	});

	test('external links have correct hrefs', async ({ page }) => {
		const cartoLink = page.locator('a[href*="carto.com"]');
		await expect(cartoLink).toBeVisible();

		const opengeoaiLink = page.locator('a[href*="opengeoai.org"]');
		await expect(opengeoaiLink).toBeVisible();

		const mundiLink = page.locator('a[href*="mundi.ai"]');
		await expect(mundiLink).toBeVisible();

		const ballotLink = page.locator('a[href*="ballot-location"]');
		await expect(ballotLink).toBeVisible();

		const namiLink = page.locator('a[href*="nami"]');
		await expect(namiLink).toBeVisible();
	});

	test('back to blog link works', async ({ page }) => {
		const backLink = page.locator('a', { hasText: 'Back to all posts' });
		await expect(backLink).toBeVisible();
		await backLink.click();
		await expect(page).toHaveURL(/\/blog\/?$/);
	});
});
