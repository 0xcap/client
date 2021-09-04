<script>

	import { onDestroy } from 'svelte'

	import Modal from './Modal.svelte'
	
	import { selectProduct } from '../lib/helpers'
	import { CHAINLINK_FULL_ICON } from '../lib/icons'
	import { LOGOS } from '../lib/logos'
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
		max-height: 420px;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
		border-bottom: 1px solid rgb(30,30,30);
		font-size: 115%;
		font-weight: 700;
		cursor: pointer;
	}
	.row:hover, .row.selected {
		background-color: rgb(30,30,30);
	}
	.row.selected {
		cursor: default !important;
	}
	.row:last-child {
		border-bottom: none;
	}

	.product-wrap {
		display: flex;
		align-items: center;
	}

	.product-wrap img {
		width: 32px;
		height: 32px;
		border-radius: 32px;
		margin-right: 12px;
	}

	.price {
		font-weight: 400;
	}
	.price.empty {
		color: var(--gray);
	}

	.bottom-container {
		border-top: 1px solid rgb(30,30,30);
	}

	.leverage-select {
		padding: var(--base-padding);
		padding-bottom: 0;
		font-size: 115%;
	}

	.leverage-select .header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--base-padding);
	}

	.leverage-select .header .label {
		color: var(--gray-light);
	}

	.leverage-select .header .value {
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
		border-top: 1px solid rgb(30,30,30);
	}

	:global(.details svg) {
		height: 24px;
		fill: var(--gray-light);
		margin-left: 8px;
		margin-bottom: -2px;
	}

</style>

<Modal title='Products' doneButton={true}>

	<div class='product-list no-scrollbar'>

		{#each $productList as product}

			<div class='row' class:selected={product.id == $selectedProductId} on:click={() => {selectProduct(product.id)}}>

				<div class='product-wrap'>
					<img src={LOGOS[product.id]} alt={`${product.symbol} logo`}>
					<span>{product.symbol}</span>
				</div>

				<div class:empty={!$prices[product.id]} class='price'>{formatToDisplay($prices[product.id], product.id) || 'Tap for price'}</div>

			</div>

		{/each}

	</div>

	<div class='bottom-container'>

		<div class='leverage-select'>
			<div class='header'>
				<div class='label'>Leverage</div>
				<div class='value'>{$leverage}x</div>
			</div>
			<div class='range'>
				<input type=range bind:value={$leverage} min=1 max={$selectedProduct.maxLeverage * 1 || 100}> 
			</div>
		</div>

		<div class='details'>
			{$selectedProduct.fee}% fee | -{funding}% 8h funding
		</div>

		<div class='details border-top'>
			Prices provided by {@html CHAINLINK_FULL_ICON}
		</div>

	</div>

</Modal>