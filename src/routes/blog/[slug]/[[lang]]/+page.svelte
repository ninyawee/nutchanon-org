<script lang="ts">
	import type { PageData } from './$types';
	import { copyCode } from '$lib/copy-code.svelte';
	import { lightbox } from '$lib/lightbox.svelte';
	import { postPath } from '$lib/i18n';
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	let { data }: { data: PageData } = $props();

	const SITE = 'https://nutchanon.org';
	let canonical = $derived(SITE + postPath(data.slug, data.lang, data.langs));
</script>

<svelte:head>
	<title>{data.meta.title} - Nutchanon</title>
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href={canonical} />
	{#each data.langs as l (l)}
		<link rel="alternate" hreflang={l} href={SITE + postPath(data.slug, l, data.langs)} />
	{/each}
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="article" />
	{#if data.meta.image}
		<meta property="og:image" content={SITE + data.meta.image} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={SITE + data.meta.image} />
	{/if}
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
</svelte:head>

<article lang={data.lang}>
	<header>
		{#if data.langs.length > 1}
			<LanguageSwitcher slug={data.slug} lang={data.lang} langs={data.langs} />
		{/if}
		<h1>{data.meta.title}</h1>
		<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
	</header>

	<div class="content" use:copyCode use:lightbox>
		<data.content />
	</div>

	<footer>
		<a href="/blog">&larr; Back to all posts</a>
	</footer>
</article>

<script lang="ts" module>
	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<style>
	article {
		max-width: 100%;
	}

	header {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	header :global(.lang-switch) {
		margin-bottom: 1.25rem;
	}

	header h1 {
		margin-bottom: 0.5rem;
	}

	time {
		color: var(--color-text-muted);
		font-size: 0.9rem;
	}

	.content {
		margin-bottom: 3rem;
	}

	.content :global(h2) {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	.content :global(h3) {
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.content :global(ul),
	.content :global(ol) {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.content :global(li) {
		margin-bottom: 0.5rem;
	}

	.content :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	.content :global(blockquote) {
		border-left: 3px solid var(--color-primary);
		padding-left: 1rem;
		margin: 1.5rem 0;
		color: var(--color-text-muted);
	}

	footer {
		padding-top: 2rem;
		border-top: 1px solid var(--color-border);
	}
</style>
