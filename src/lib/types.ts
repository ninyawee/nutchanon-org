export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	published: boolean;
}

export interface BlogPostModule {
	metadata: BlogPost;
	default: unknown;
}
