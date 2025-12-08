<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.meta.title} - Nutchanon</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<article>
	<header>
		<h1>{data.meta.title}</h1>
		<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
	</header>

	<div class="content">
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
