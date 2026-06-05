<script lang="ts">
	import { LANG_LABELS, postPath, type Lang } from '$lib/i18n';

	let {
		slug,
		lang,
		langs
	}: { slug: string; lang: Lang; langs: Lang[] } = $props();
</script>

{#if langs.length > 1}
	<nav class="lang-switch" aria-label="Language">
		{#each langs as l (l)}
			<a
				href={postPath(slug, l, langs)}
				class:active={l === lang}
				aria-current={l === lang ? 'true' : undefined}
				hreflang={l}
			>
				{LANG_LABELS[l]}
			</a>
		{/each}
	</nav>
{/if}

<style>
	.lang-switch {
		display: flex;
		gap: 0.5rem;
	}

	.lang-switch a {
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		border: 1px solid var(--color-border);
		color: var(--color-text-muted);
		font-size: 0.875rem;
		line-height: 1;
	}

	.lang-switch a:hover {
		color: var(--color-text);
		text-decoration: none;
	}

	.lang-switch a.active {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}
</style>
