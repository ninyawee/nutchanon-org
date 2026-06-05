import type { Component } from 'svelte';
import type { Lang } from './i18n';

export interface BlogPostMeta {
	title: string;
	description: string;
	date: string;
	published: boolean;
	image?: string;
	/** Optional language hint for legacy single-file posts. Folder posts derive it from the filename. */
	lang?: Lang;
}

export interface BlogPost extends BlogPostMeta {
	slug: string;
	/** Language of this listing entry (the post's primary language). */
	lang: Lang;
	/** All languages this post is available in. */
	langs: Lang[];
}

export interface BlogPostModule {
	metadata: BlogPostMeta;
	default: Component;
}
