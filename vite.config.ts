import devtoolsJson from 'vite-plugin-devtools-json';
import { imagetools } from 'vite-imagetools';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [imagetools(), sveltekit(), devtoolsJson()]
});
