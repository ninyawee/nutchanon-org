<script lang="ts">
	import { onMount } from 'svelte';

	const directions = [
		{ label: 'N', angle: -90, hit: 'path@25m', hitDist: 0.3 },
		{ label: 'NE', angle: -45, hit: 'shed@39m', hitDist: 0.4 },
		{ label: 'E', angle: 0, hit: 'compound@64m', hitDist: 0.6 },
		{ label: 'SE', angle: 45, hit: 'path@25m', hitDist: 0.3 },
		{ label: 'S', angle: 90, hit: 'bldg@31m', hitDist: 0.35 },
		{ label: 'SW', angle: 135, hit: 'bldg@72m', hitDist: 0.65 },
		{ label: 'W', angle: 180, hit: '', hitDist: 0 },
		{ label: 'NW', angle: -135, hit: '', hitDist: 0 }
	];

	const cx = 200;
	const cy = 200;
	const maxR = 160;

	function endPoint(angle: number, dist: number) {
		const rad = (angle * Math.PI) / 180;
		return {
			x: cx + Math.cos(rad) * maxR * dist,
			y: cy + Math.sin(rad) * maxR * dist
		};
	}

	function labelPoint(angle: number) {
		const rad = (angle * Math.PI) / 180;
		const r = maxR + 20;
		return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
	}

	let svgEl: SVGSVGElement;

	onMount(async () => {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const rays = svgEl.querySelectorAll('.ray-line');
		const dots = svgEl.querySelectorAll('.hit-dot');
		const labels = svgEl.querySelectorAll('.hit-label');

		if (prefersReduced) {
			rays.forEach((r) => ((r as SVGElement).style.opacity = '1'));
			dots.forEach((d) => ((d as SVGElement).style.opacity = '1'));
			labels.forEach((l) => ((l as SVGElement).style.opacity = '1'));
			return;
		}

		gsap.set([rays, dots, labels], { opacity: 0 });
		rays.forEach((r) => {
			const len = (r as SVGLineElement).getTotalLength?.() || 100;
			gsap.set(r, { strokeDasharray: len, strokeDashoffset: len });
		});

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: svgEl,
				start: 'top 70%',
				toggleActions: 'play none none reverse'
			}
		});

		tl.to(rays, {
			opacity: 1,
			strokeDashoffset: 0,
			duration: 0.6,
			stagger: 0.08,
			ease: 'power2.out'
		})
			.to(dots, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06 }, '-=0.3')
			.to(labels, { opacity: 1, duration: 0.3, stagger: 0.06 }, '-=0.2');

		return () => {
			tl.kill();
		};
	});
</script>

<figure class="raycast-viz">
	<svg bind:this={svgEl} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
		<!-- Concentric range rings -->
		{#each [0.25, 0.5, 0.75, 1] as r}
			<circle {cx} {cy} r={maxR * r} fill="none" stroke="#333" stroke-width="0.5" stroke-dasharray="4 4" />
		{/each}

		<!-- Center point -->
		<circle {cx} {cy} r="6" fill="#00b894" />
		<text x={cx} y={cy - 12} text-anchor="middle" fill="#00b894" font-size="11" font-weight="600">subject</text>

		<!-- Rays -->
		{#each directions as dir}
			{@const end = dir.hit ? endPoint(dir.angle, dir.hitDist) : endPoint(dir.angle, 0.9)}
			{@const lbl = labelPoint(dir.angle)}
			<line
				class="ray-line"
				x1={cx}
				y1={cy}
				x2={end.x}
				y2={end.y}
				stroke={dir.hit ? '#e67e22' : '#555'}
				stroke-width="2"
				stroke-linecap="round"
			/>
			{#if dir.hit}
				<circle class="hit-dot" cx={end.x} cy={end.y} r="5" fill="#e67e22" />
				<text class="hit-label" x={end.x} y={end.y - 10} text-anchor="middle" fill="#e67e22" font-size="9" font-weight="600">
					{dir.hit}
				</text>
			{/if}
			<text
				x={lbl.x}
				y={lbl.y}
				text-anchor="middle"
				dominant-baseline="central"
				fill="#888"
				font-size="11"
				font-weight="700"
			>
				{dir.label}
			</text>
		{/each}

		<!-- "inside" label -->
		<text x={cx} y={cy + 24} text-anchor="middle" fill="#aaa" font-size="10">
			inside: residential, scrub
		</text>
	</svg>
	<figcaption>8-ray raycast from subject point — DRC example. Orange = hit, gray = open space.</figcaption>
</figure>

<style>
	.raycast-viz {
		max-width: 420px;
		margin: 2rem auto;
	}

	.raycast-viz svg {
		width: 100%;
		height: auto;
		background: #0d0d1a;
		border-radius: 12px;
		border: 1px solid #222;
	}

	figcaption {
		text-align: center;
		font-size: 0.8rem;
		color: #888;
		margin-top: 0.5rem;
	}
</style>
