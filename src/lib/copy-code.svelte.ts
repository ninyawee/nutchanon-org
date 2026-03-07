/**
 * Svelte action that adds copy buttons to all <pre> blocks within an element.
 */
export function copyCode(node: HTMLElement) {
	const pres = node.querySelectorAll('pre');

	for (const pre of pres) {
		pre.style.position = 'relative';

		const button = document.createElement('button');
		button.className = 'copy-code-btn';
		button.setAttribute('aria-label', 'Copy code');
		setCopyIcon(button);

		button.addEventListener('click', () => {
			const code = pre.querySelector('code');
			const text = code?.textContent ?? pre.textContent ?? '';
			navigator.clipboard.writeText(text).then(() => {
				setCheckIcon(button);
				button.classList.add('copied');
				setTimeout(() => {
					setCopyIcon(button);
					button.classList.remove('copied');
				}, 2000);
			});
		});

		pre.appendChild(button);
	}

	return {
		destroy() {
			const buttons = node.querySelectorAll('.copy-code-btn');
			for (const btn of buttons) btn.remove();
		}
	};
}

function createSvg(paths: SVGElement[]): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('width', '16');
	svg.setAttribute('height', '16');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	for (const p of paths) svg.appendChild(p);
	return svg;
}

function setCopyIcon(button: HTMLButtonElement) {
	button.replaceChildren();
	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('x', '9');
	rect.setAttribute('y', '9');
	rect.setAttribute('width', '13');
	rect.setAttribute('height', '13');
	rect.setAttribute('rx', '2');
	rect.setAttribute('ry', '2');
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
	button.appendChild(createSvg([rect, path]));
}

function setCheckIcon(button: HTMLButtonElement) {
	button.replaceChildren();
	const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	polyline.setAttribute('points', '20 6 9 17 4 12');
	button.appendChild(createSvg([polyline]));
}
