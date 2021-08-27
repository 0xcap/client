<script>

	import { onDestroy } from 'svelte'

	import Modal from './Modal.svelte'
	
	import { LOGOS } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { CHAINLINK_FULL_ICON } from '../lib/icons'
	import { formatToDisplay, setCachedLeverage } from '../lib/utils'

	import { leverage } from '../stores/order'
	import { prices } from '../stores/prices'
	import { selectedProductId, selectedProduct, productList } from '../stores/products'
	
	const unsubscribe = leverage.subscribe(value => {
		setCachedLeverage($selectedProductId, value);
	});

	onDestroy(unsubscribe);

	// 8h funding
	let funding = 0;
	$: funding = (($selectedProduct.interest * 1) / 360 / 3).toFixed(4) || 0;

</script>

<style>

	.product-list {
		overflow-y: scroll;
		max-height: 220px;
	}

	.product-list a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
		font-size: 20px;
		color: inherit;
	}

	.product-list a:hover, .product-list a.selected {
		background-color: var(--gray-between);
	}

	.product-list a.selected {
		cursor: default;
	}

	.product-wrap {
		display: flex;
		align-items: center;
	}

	.product-wrap img {
		width: 24px;
		height: 24px;
		border-radius: 24px;
		margin-right: 8px;
	}

	.leverage-container {
		border-top: 1px solid var(--gray-dark);
		padding: var(--base-padding);
		padding-bottom: 0;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: var(--base-padding);
		font-size: 20px;
	}

	.value {
		font-weight: 700;
	}

	.details {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding: var(--base-padding);
		color: var(--gray-light);
		font-size: 80%;
	}

	.border-top {
		border-top: 1px solid var(--gray-dark);
	}

	:global(.details svg) {
		height: 24px;
		fill: var(--gray-light);
		margin-left: 8px;
		margin-bottom: -2px;
	}

</style>

<Modal title='Products'>

	<div class='product-list'>

		{#each $productList as product}
			<a class:selected={product.id == $selectedProductId} on:click={() => {selectProduct(product.id)}}>
				<div class='product-wrap'>
					<img src={LOGOS[product.id]} alt={`${product.symbol} logo`}>
					<span>{product.symbol}</span>
				</div>
				<div>{formatToDisplay($prices[product.id], product.id) || ''}</div>
			</a>
		{/each}

	</div>

	<div class='leverage-container'>
		<div class='row'>
			<div class='label'>Leverage</div>
			<div class='value'>{$leverage}x</div>
		</div>
		<div class='range'>
			<input type=range bind:value={$leverage} min=1 max={$selectedProduct.leverage * 1 || 100}> 
		</div>
	</div>

	<div class='details'>
		{$selectedProduct.fee}% fee | -{funding}% 8h funding
	</div>

	<div class='details border-top'>
		Prices provided by {@html CHAINLINK_FULL_ICON}
	</div>

</Modal>