<script lang="ts">
	import { onMount } from 'svelte';

	const steps = [
		{ label: 'Raw GeoJSON', tokens: 39114, color: '#c0392b' },
		{ label: 'Clipped', tokens: 1719, color: '#e67e22' },
		{ label: 'H3 Grid', tokens: 880, color: '#f39c12' },
		{ label: 'Natural Lang', tokens: 173, color: '#27ae60' },
		{ label: 'Compact Grid', tokens: 121, color: '#2ecc71' },
		{ label: 'Raycast', tokens: 57, color: '#00b894' }
	];

	const maxTokens = steps[0].tokens;

	let containerEl: HTMLElement;

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const bars = containerEl.querySelectorAll('.funnel-bar-fill');

		if (prefersReduced) {
			bars.forEach((bar, i) => {
				(bar as HTMLElement).style.width = `${(steps[i].tokens / maxTokens) * 100}%`;
			});
			return;
		}

		gsap.set(bars, { width: '0%' });

		const st = ScrollTrigger.create({
			trigger: containerEl,
			start: 'top 75%',
			end: 'bottom 25%',
			scrub: 1,
			onUpdate: (self) => {
				bars.forEach((bar, i) => {
					const pct = (steps[i].tokens / maxTokens) * 100;
					const progress = Math.min(self.progress * (steps.length / (i + 1)), 1);
					(bar as HTMLElement).style.width = `${pct * progress}%`;
				});
			}
		});

		return () => st.kill();
	});
</script>

<div class="compression-funnel" bind:this={containerEl}>
	{#each steps as step}
		<div class="funnel-row">
			<span class="funnel-label">{step.label}</span>
			<div class="funnel-bar-track">
				<div class="funnel-bar-fill" style="background: {step.color}; width: {(step.tokens / maxTokens) * 100}%"></div>
			</div>
			<span class="funnel-tokens" style="color: {step.color}">{step.tokens.toLocaleString()}</span>
		</div>
	{/each}
</div>

<style>
	.compression-funnel {
		margin: 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.funnel-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.funnel-label {
		width: 7rem;
		text-align: right;
		font-size: 0.8rem;
		color: #aaa;
		flex-shrink: 0;
	}

	.funnel-bar-track {
		flex: 1;
		height: 1.4rem;
		background: #1a1a2e;
		border-radius: 4px;
		overflow: hidden;
	}

	.funnel-bar-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.05s linear;
	}

	.funnel-tokens {
		width: 4.5rem;
		text-align: right;
		font-size: 0.8rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		flex-shrink: 0;
	}

	@media (max-width: 480px) {
		.funnel-label {
			width: 5rem;
			font-size: 0.7rem;
		}

		.funnel-tokens {
			width: 3.5rem;
			font-size: 0.7rem;
		}
	}
</style>
