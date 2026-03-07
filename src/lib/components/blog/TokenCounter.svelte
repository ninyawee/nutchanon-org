<script lang="ts">
	import { onMount } from 'svelte';

	const steps = [
		{ tokens: 39114, color: '#c0392b', label: 'Raw GeoJSON' },
		{ tokens: 1719, color: '#e67e22', label: 'Clipped' },
		{ tokens: 880, color: '#f39c12', label: 'H3 Grid' },
		{ tokens: 173, color: '#27ae60', label: 'Natural Lang' },
		{ tokens: 121, color: '#2ecc71', label: 'Compact Grid' },
		{ tokens: 57, color: '#00b894', label: 'Raycast' }
	];

	const stepIds = [
		'step-raw-geojson',
		'step-clip-viewport',
		'step-h3-hexagonal',
		'step-natural-language',
		'step-compact-grid',
		'step-raycast'
	];

	let counterEl: HTMLElement;
	let currentTokens = $state(39114);
	let currentColor = $state('#c0392b');
	let currentLabel = $state('Raw GeoJSON');
	let visible = $state(false);

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		visible = true;

		const cleanups: (() => void)[] = [];

		stepIds.forEach((id, i) => {
			const el = document.getElementById(id);
			if (!el) return;

			const st = ScrollTrigger.create({
				trigger: el,
				start: 'top 60%',
				onEnter: () => {
					const step = steps[i];
					currentLabel = step.label;
					currentColor = step.color;
					if (prefersReduced) {
						currentTokens = step.tokens;
					} else {
						gsap.to(
							{ val: currentTokens },
							{
								val: step.tokens,
								duration: 0.8,
								ease: 'power2.out',
								onUpdate() {
									currentTokens = Math.round(this.targets()[0].val);
								}
							}
						);
					}
				},
				onLeaveBack: () => {
					if (i > 0) {
						const prev = steps[i - 1];
						currentLabel = prev.label;
						currentColor = prev.color;
						if (prefersReduced) {
							currentTokens = prev.tokens;
						} else {
							gsap.to(
								{ val: currentTokens },
								{
									val: prev.tokens,
									duration: 0.8,
									ease: 'power2.out',
									onUpdate() {
										currentTokens = Math.round(this.targets()[0].val);
									}
								}
							);
						}
					}
				}
			});
			cleanups.push(() => st.kill());
		});

		return () => {
			cleanups.forEach((fn) => fn());
		};
	});
</script>

{#if visible}
	<div class="token-counter" bind:this={counterEl} style="--counter-color: {currentColor}">
		<div class="token-value">{currentTokens.toLocaleString()}</div>
		<div class="token-label">tokens</div>
		<div class="token-step">{currentLabel}</div>
	</div>
{/if}

<style>
	.token-counter {
		position: fixed;
		top: 5rem;
		right: 1.5rem;
		z-index: 50;
		background: color-mix(in srgb, var(--counter-color) 12%, #1a1a2e 88%);
		border: 2px solid var(--counter-color);
		border-radius: 12px;
		padding: 0.75rem 1rem;
		text-align: center;
		min-width: 7rem;
		backdrop-filter: blur(8px);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
		transition:
			border-color 0.4s,
			background 0.4s;
	}

	.token-value {
		font-size: 1.6rem;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		color: var(--counter-color);
		line-height: 1.2;
		transition: color 0.4s;
	}

	.token-label {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #aaa;
		margin-top: 0.1rem;
	}

	.token-step {
		font-size: 0.7rem;
		color: var(--counter-color);
		margin-top: 0.25rem;
		font-weight: 600;
		transition: color 0.4s;
	}

	@media (max-width: 768px) {
		.token-counter {
			top: auto;
			bottom: 1rem;
			right: 1rem;
			padding: 0.5rem 0.75rem;
			min-width: 5.5rem;
		}

		.token-value {
			font-size: 1.2rem;
		}
	}
</style>
