import { test, expect } from '@playwright/test';

const SLUG = '/blog/claude-code-sudo-hook/';

test.describe('Blog: Claude Code Sudo Hook', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(SLUG);
	});

	test('page loads and title renders', async ({ page }) => {
		await expect(page).toHaveTitle(/sudo claude/i);
		await expect(page.locator('h1')).toContainText(
			"Don't sudo claude"
		);
	});

	test('OG meta tags are present with image', async ({ page }) => {
		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute('content', /sudo claude/i);

		const ogDesc = page.locator('meta[property="og:description"]');
		await expect(ogDesc).toHaveAttribute('content', /zenity/i);

		const ogImage = page.locator('meta[property="og:image"]');
		await expect(ogImage).toHaveAttribute(
			'content',
			/\/blog\/claude-code-sudo-hook\/og\.png$/
		);

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute('content', 'article');

		const twitterCard = page.locator('meta[name="twitter:card"]');
		await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');

		const twitterImage = page.locator('meta[name="twitter:image"]');
		await expect(twitterImage).toHaveAttribute(
			'content',
			/\/blog\/claude-code-sudo-hook\/og\.png$/
		);
	});

	test('OG image URL is accessible', async ({ request }) => {
		const response = await request.get('/blog/claude-code-sudo-hook/og.png');
		expect(response.status()).toBe(200);
		expect(response.headers()['content-type']).toContain('image');
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

	test('language switcher works - EN/TH/CN', async ({ page }) => {
		// Default is EN
		await expect(page.locator('h2', { hasText: 'The Problem' })).toBeVisible();

		// Switch to TH
		await page.locator('button', { hasText: 'TH' }).click();
		await expect(page.locator('h2', { hasText: 'ปัญหา' })).toBeVisible();
		await expect(page.locator('h2', { hasText: 'The Problem' })).not.toBeVisible();

		// Switch to CN
		await page.locator('button', { hasText: 'CN' }).click();
		await expect(page.locator('h2', { hasText: '问题' })).toBeVisible();
		await expect(page.locator('h2', { hasText: 'ปัญหา' })).not.toBeVisible();

		// Switch back to EN
		await page.locator('button', { hasText: 'EN' }).click();
		await expect(page.locator('h2', { hasText: 'The Problem' })).toBeVisible();
	});

	test('all EN section headings render', async ({ page }) => {
		const expectedHeadings = [
			'The Problem',
			'The Solution',
			'The Code',
			'Hook Registration',
			'Setup',
			'macOS Note',
			'Source'
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
		expect(count).toBeGreaterThanOrEqual(1);
	});

	test('GitHub dotfiles links are present', async ({ page }) => {
		const dotfilesLink = page.locator('a[href*="ninyawee/dotfiles"]').first();
		await expect(dotfilesLink).toBeVisible();

		const sudoConfirmLink = page.locator('a[href*="executable_sudo-confirm.js"]').first();
		await expect(sudoConfirmLink).toBeVisible();

		const askpassLink = page.locator('a[href*="executable_sudo-askpass.sh"]').first();
		await expect(askpassLink).toBeVisible();
	});

	test('Claude Code hooks docs link is present', async ({ page }) => {
		const hooksLink = page.locator('a[href*="docs.anthropic.com"]').first();
		await expect(hooksLink).toBeVisible();
	});

	test('back to blog link works', async ({ page }) => {
		const backLink = page.locator('a', { hasText: 'Back to all posts' });
		await expect(backLink).toBeVisible();
		await backLink.click();
		await expect(page).toHaveURL(/\/blog\/?$/);
	});
});
