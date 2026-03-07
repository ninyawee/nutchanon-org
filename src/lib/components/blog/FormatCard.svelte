<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		title: string;
		description: string;
		tokens: string;
		color: string;
		index?: number;
	}

	let { title, description, tokens, color, index = 0 }: Props = $props();

	let cardEl: HTMLElement;

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (prefersReduced) return;

		gsap.set(cardEl, { opacity: 0, y: 30 });

		const st = ScrollTrigger.create({
			trigger: cardEl,
			start: 'top 80%',
			onEnter: () => {
				gsap.to(cardEl, {
					opacity: 1,
					y: 0,
					duration: 0.5,
					delay: index * 0.1,
					ease: 'power2.out'
				});
			},
			once: true
		});

		return () => st.kill();
	});
</script>

<div class="format-card" bind:this={cardEl} style="--card-color: {color}">
	<div class="card-header">
		<span class="card-title">{title}</span>
		<span class="card-tokens">{tokens}</span>
	</div>
	<p class="card-desc">{description}</p>
</div>

<style>
	.format-card {
		background: #0d0d1a;
		border: 1px solid #222;
		border-left: 3px solid var(--card-color);
		border-radius: 8px;
		padding: 1rem 1.25rem;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.4rem;
	}

	.card-title {
		font-weight: 700;
		font-size: 0.95rem;
		color: #eee;
	}

	.card-tokens {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--card-color);
		font-variant-numeric: tabular-nums;
	}

	.card-desc {
		font-size: 0.8rem;
		color: #999;
		margin: 0;
		line-height: 1.4;
	}
</style>
