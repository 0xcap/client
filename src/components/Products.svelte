<script>
	import { onDestroy } from 'svelte'
	import { hideModal } from '../stores/modals'
	import { setProductId, listProducts } from '../lib/methods'

	import { productId, productInfo, leverage, setCachedLeverage } from '../stores/order'

	let products = listProducts();

	const unsubscribe = leverage.subscribe(value => {
		setCachedLeverage($productId, value);
	});

	onDestroy(unsubscribe);

</script>

<style>
	.selected {
		font-weight: 800;
	}
</style>

<div class='container'>
	<div>
		Products modal <a on:click={hideModal}>Close</a>. 
		{#each products as product}
			<a class:selected={product.id == $productId} on:click={() => {setProductId(product.id)}}>{product.symbol}</a> |
		{/each}
	</div>
	<div>
		Leverage: <input type=range bind:value={$leverage} min=1 max={$productInfo.leverage * 1 || 100}> {$leverage}
	</div>
	<div>
		Fee: {$productInfo.fee}%, Interest: {$productInfo.interest}%
	</div>
</div>