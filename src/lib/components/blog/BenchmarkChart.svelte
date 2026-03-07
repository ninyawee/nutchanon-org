<script lang="ts">
	import { onMount } from 'svelte';

	const data = [
		{ format: 'Raycast', tokens: 137, score: 8, maxScore: 8, color: '#00b894', winner: true },
		{ format: 'NatLang', tokens: 173, score: 6.5, maxScore: 8, color: '#27ae60', winner: false },
		{ format: 'Grid', tokens: 121, score: 5, maxScore: 8, color: '#2ecc71', winner: false },
		{ format: 'Screenshot', tokens: 3200, score: 7, maxScore: 8, color: '#636e72', winner: false }
	];

	const maxTokens = 3200;

	let chartEl: HTMLElement;

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const tokenBars = chartEl.querySelectorAll('.bar-tokens');
		const scoreBars = chartEl.querySelectorAll('.bar-score');

		if (prefersReduced) return;

		gsap.set([tokenBars, scoreBars], { scaleX: 0, transformOrigin: 'left center' });

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: chartEl,
				start: 'top 70%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.to(tokenBars, {
			scaleX: 1,
			duration: 0.8,
			stagger: 0.12,
			ease: 'power2.out'
		}).to(
			scoreBars,
			{
				scaleX: 1,
				duration: 0.6,
				stagger: 0.12,
				ease: 'power2.out'
			},
			'-=0.5'
		);

		return () => tl.kill();
	});
</script>

<div class="benchmark-chart" bind:this={chartEl}>
	<div class="chart-header">
		<span class="chart-title">Benchmark Results</span>
		<div class="chart-legend">
			<span class="legend-item"><span class="legend-swatch" style="background: #555"></span>Tokens</span>
			<span class="legend-item"><span class="legend-swatch" style="background: #00b894"></span>Accuracy</span>
		</div>
	</div>

	{#each data as row}
		<div class="chart-row" class:winner={row.winner}>
			<span class="chart-label">{row.format}</span>
			<div class="chart-bars">
				<div class="bar-track">
					<div
						class="bar-tokens"
						style="width: {(row.tokens / maxTokens) * 100}%; background: {row.winner ? row.color : '#555'}"
					></div>
					<span class="bar-value">{row.tokens.toLocaleString()} tok</span>
				</div>
				<div class="bar-track">
					<div
						class="bar-score"
						style="width: {(row.score / row.maxScore) * 100}%; background: {row.color}"
					></div>
					<span class="bar-value">{row.score}/{row.maxScore}</span>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.benchmark-chart {
		margin: 2rem 0;
		background: #0d0d1a;
		border-radius: 12px;
		border: 1px solid #222;
		padding: 1.5rem;
	}

	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
	}

	.chart-title {
		font-size: 1rem;
		font-weight: 700;
		color: #eee;
	}

	.chart-legend {
		display: flex;
		gap: 1rem;
		font-size: 0.75rem;
		color: #888;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.3rem;
	}

	.legend-swatch {
		width: 10px;
		height: 10px;
		border-radius: 2px;
		display: inline-block;
	}

	.chart-row {
		margin-bottom: 1rem;
	}

	.chart-row.winner {
		padding: 0.5rem;
		background: rgba(0, 184, 148, 0.06);
		border-radius: 8px;
		border: 1px solid rgba(0, 184, 148, 0.2);
	}

	.chart-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: #ccc;
		margin-bottom: 0.3rem;
		display: block;
	}

	.chart-bars {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.bar-track {
		height: 1.1rem;
		background: #1a1a2e;
		border-radius: 4px;
		overflow: hidden;
		position: relative;
	}

	.bar-tokens,
	.bar-score {
		height: 100%;
		border-radius: 4px;
	}

	.bar-value {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.7rem;
		color: #aaa;
		font-variant-numeric: tabular-nums;
	}
</style>
