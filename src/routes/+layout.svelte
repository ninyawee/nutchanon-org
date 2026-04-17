<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import AnimatedLogo from '$lib/components/AnimatedLogo.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="alternate" type="application/rss+xml" title="Nutchanon" href="/rss.xml" />
	<title>Nutchanon</title>
</svelte:head>

<div class="container">
	<header>
		<nav>
			<a href="/" class="logo" aria-label="Nutchanon — home"><AnimatedLogo /></a>
			<div class="nav-links">
				<a href="/">Home</a>
				<a href="/blog">Blog</a>
			</div>
		</nav>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>
			&copy; {new Date().getFullYear()} Nutchanon. All rights reserved.
			<a href="https://webring.wonderful.software#nutchanon.org" title="วงแหวนเว็บ" class="webring">
				<img alt="วงแหวนเว็บ" width="20" height="20" src="https://webring.wonderful.software/webring.black.svg" />
			</a>
		</p>
	</footer>
</div>

<style>
	.container {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 1.5rem;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	header {
		padding: 2rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--color-text);
	}

	.logo:hover {
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
	}

	.nav-links a {
		color: var(--color-text-muted);
	}

	.nav-links a:hover {
		color: var(--color-text);
		text-decoration: none;
	}

	main {
		flex: 1;
		padding: 3rem 0;
	}

	footer {
		padding: 2rem 0;
		border-top: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}
</style>
