export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	published: boolean;
	image?: string;
}

export interface BlogPostModule {
	metadata: BlogPost;
	default: unknown;
}
