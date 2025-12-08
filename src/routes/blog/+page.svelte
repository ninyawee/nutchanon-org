<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Blog - Nutchanon</title>
	<meta name="description" content="All blog posts" />
</svelte:head>

<h1>Blog</h1>

{#if data.posts.length === 0}
	<p class="no-posts">No posts yet. Check back soon!</p>
{:else}
	<ul class="post-list">
		{#each data.posts as post}
			<li>
				<a href="/blog/{post.slug}">
					<article>
						<h2>{post.title}</h2>
						<p class="description">{post.description}</p>
						<time datetime={post.date}>{formatDate(post.date)}</time>
					</article>
				</a>
			</li>
		{/each}
	</ul>
{/if}

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
	h1 {
		margin-bottom: 2rem;
	}

	.no-posts {
		color: var(--color-text-muted);
	}

	.post-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2rem;
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

	.post-list h2 {
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
</style>
