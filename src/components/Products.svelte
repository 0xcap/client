<script>
	import { onDestroy } from 'svelte'
	import { setProductId, listProducts } from '../lib/methods'
	import { LOGOS } from '../lib/constants'

	import Modal from './Modal.svelte'
	import { prices } from '../stores/prices'

	import { CHAINLINK_FULL_ICON } from '../lib/icons'

	import { leverage, setCachedLeverage } from '../stores/order'
	import { productId, productInfo } from '../stores/products'
	import { formatPrice } from '../lib/utils'

	let products = listProducts();

	const unsubscribe = leverage.subscribe(value => {
		setCachedLeverage($productId, value);
	});

	onDestroy(unsubscribe);

	// 8h funding
	let funding = 0;
	$: funding = (($productInfo.interest * 1) / 360 / 3).toFixed(4) || 0;

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

	.product-list .product {
		display: flex;
		align-items: center;
	}

	.product-list a.selected {
		cursor: default;
	}

	.product-list a:hover, .product-list a.selected {
		background-color: var(--gray-dark);
	}
	.product-list a img {
		width: 24px;
		height: 24px;
		border-radius: 24px;
		margin-right: 10px;
	}

	.product-list a .check {
		color: var(--blue);
	}

	.leverage-container {
		border-top: 1px solid var(--gray-dark);
		padding: var(--base-padding);
	}

		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: var(--base-padding);
		}

			.value {
				font-size: 20px;
				font-weight: 700;
			}

	.details {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--base-padding);
		padding-top: 0;
		color: var(--gray-light);
		font-size: 80%;
	}

	.topped {
		border-top: 1px solid var(--gray-dark);
		padding-top: var(--base-padding);
	}

	:global(.details svg) {
		height: 22px;
		fill: var(--gray-light);
		margin-left: 6px;
		margin-bottom: -2px;
	}

</style>

<Modal title='Products'>

	<div class='product-list'>

		{#each products as product}
			<a class:selected={product.id == $productId} on:click={() => {setProductId(product.id)}}>
				<div class='product'>
					<img src={LOGOS[product.id]} alt={`${$productInfo.symbol} logo`}>
					<span>{product.symbol}</span>
				</div>
				<div>{formatPrice($prices[product.id], product.id) || ''}</div>
			</a>
		{/each}
	</div>

	<div class='leverage-container'>
		<div class='row'>
			<div class='label'>Leverage</div>
			<div class='value'>{$leverage}x</div>
		</div>
		<div class='range'>
			<input type=range bind:value={$leverage} min=1 max={$productInfo.leverage * 1 || 100}> 
		</div>
	</div>

	<div class='details'>
		{$productInfo.fee}% fee | -{funding}% 8hr funding
	</div>

	<div class='details topped'>
		Prices provided by {@html CHAINLINK_FULL_ICON}
	</div>

</Modal>