<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Nutchanon - Home</title>
	<meta name="description" content="Welcome to my personal website and blog." />
</svelte:head>

<section class="hero">
	<h1>Hi, I'm Nutchanon</h1>
	<p class="intro">
		Welcome to my corner of the internet. I write about technology, programming, and things that
		interest me.
	</p>
</section>

<section class="recent-posts">
	<h2>Recent Posts</h2>
	{#if data.posts.length === 0}
		<p class="no-posts">No posts yet. Check back soon!</p>
	{:else}
		<ul class="post-list">
			{#each data.posts.slice(0, 5) as post}
				<li>
					<a href="/blog/{post.slug}">
						<article>
							<h3>{post.title}</h3>
							<p class="description">{post.description}</p>
							<time datetime={post.date}>{formatDate(post.date)}</time>
						</article>
					</a>
				</li>
			{/each}
		</ul>
		{#if data.posts.length > 5}
			<a href="/blog" class="view-all">View all posts &rarr;</a>
		{/if}
	{/if}
</section>

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
	.hero {
		margin-bottom: 4rem;
	}

	.hero h1 {
		margin-bottom: 1rem;
	}

	.intro {
		font-size: 1.125rem;
		color: var(--color-text-muted);
	}

	.recent-posts h2 {
		margin-bottom: 1.5rem;
	}

	.no-posts {
		color: var(--color-text-muted);
	}

	.post-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.post-list a {
		display: block;
		color: inherit;
		padding: 1.25rem;
		margin: -1.25rem;
		border-radius: 8px;
		transition: background-color 0.15s ease;
	}

	.post-list a:hover {
		background-color: rgba(0, 0, 0, 0.03);
		text-decoration: none;
	}

	.post-list h3 {
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}

	.description {
		color: var(--color-text-muted);
		margin-bottom: 0.5rem;
	}

	time {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.view-all {
		display: inline-block;
		margin-top: 2rem;
	}
</style>
