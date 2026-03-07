/**
 * Svelte action that adds click-to-view-bigger lightbox to all images in an element.
 */
export function lightbox(node: HTMLElement) {
	let overlay: HTMLDivElement | null = null;

	function openLightbox(img: HTMLImageElement) {
		overlay = document.createElement('div');
		overlay.className = 'lightbox-overlay';

		const fullImg = document.createElement('img');
		// Use the highest resolution source available
		fullImg.src = img.currentSrc || img.src;
		fullImg.alt = img.alt;
		fullImg.className = 'lightbox-img';

		overlay.appendChild(fullImg);
		overlay.addEventListener('click', closeLightbox);
		document.body.appendChild(overlay);
		document.body.style.overflow = 'hidden';

		// Animate in
		requestAnimationFrame(() => {
			overlay?.classList.add('active');
		});
	}

	function closeLightbox() {
		if (!overlay) return;
		overlay.classList.remove('active');
		overlay.addEventListener(
			'transitionend',
			() => {
				overlay?.remove();
				overlay = null;
				document.body.style.overflow = '';
			},
			{ once: true }
		);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeLightbox();
	}

	function handleClick(e: Event) {
		const target = e.target as HTMLElement;
		if (target.tagName === 'IMG' && target.closest('.content')) {
			openLightbox(target as HTMLImageElement);
		}
	}

	node.addEventListener('click', handleClick);
	document.addEventListener('keydown', handleKeydown);

	// Style images as clickable
	const imgs = node.querySelectorAll('img');
	for (const img of imgs) {
		img.style.cursor = 'zoom-in';
	}

	return {
		destroy() {
			node.removeEventListener('click', handleClick);
			document.removeEventListener('keydown', handleKeydown);
			closeLightbox();
		}
	};
}
