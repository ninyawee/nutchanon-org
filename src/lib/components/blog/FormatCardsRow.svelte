<script lang="ts">
	import FormatCard from './FormatCard.svelte';

	const cards = [
		{
			title: 'Raycast + context',
			description: '"What\'s at this spot?" — subject-centric, 8/8 accuracy',
			tokens: '~100-150 tok',
			color: '#00b894'
		},
		{
			title: 'Natural language',
			description: '"Describe this whole area" — readable but verbose',
			tokens: '~170-360 tok',
			color: '#27ae60'
		},
		{
			title: 'Map screenshot',
			description: 'Human visualization — expensive for AI',
			tokens: '~3,200 tok',
			color: '#636e72'
		},
		{
			title: 'Clipped GeoJSON',
			description: 'Code/GIS processing — machine-readable',
			tokens: '~1,200 tok',
			color: '#e67e22'
		}
	];
</script>

<div class="cards-row">
	{#each cards as card, i}
		<FormatCard title={card.title} description={card.description} tokens={card.tokens} color={card.color} index={i} />
	{/each}
</div>

<style>
	.cards-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
		margin: 2rem 0;
	}
</style>
