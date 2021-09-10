<script>

	import { onMount, onDestroy } from 'svelte'

	import Helper from './Helper.svelte'
	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
		
	import { BASE_SYMBOL } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { EDIT_ICON, CANCEL_ICON } from '../lib/icons'
	import { LOGOS } from '../lib/logos'
	import { formatToDisplay, setCachedLeverage } from '../lib/utils'

	import { leverage } from '../stores/order'
	import { prices } from '../stores/prices'
	import { selectedProductId, selectedProduct, productList } from '../stores/products'
	import { selectedAddress } from '../stores/wallet'
	
	const unsubscribe = leverage.subscribe(value => {
		setCachedLeverage($selectedProductId, value);
	});

	onDestroy(unsubscribe);

	let searchIsFocused = false;

	let rangeShown = false;
	function toggleRange() {
		rangeShown = !rangeShown;
	}

	let _productListDisplayed = [];

	let query;
	function search(query) {
		if (!query) {
			_productListDisplayed = $productList;
			return;
		}
		let productsToKeep = [];
		for (const p of $productList) {
			if (p.symbol.toLowerCase().includes(query.toLowerCase())) productsToKeep.push(p);
		}
		_productListDisplayed = productsToKeep;
	}

	$: search(query);
	
	onMount(() => {
		_productListDisplayed = $productList;
		document.getElementById('search').focus();
	});

	let rows;
	$: rows = [
		{
			label: 'Fee',
			value: `${$selectedProduct.fee}%`,
			dim: true,
			helper: 'Fee to open or close a position.'
		},
		{
			label: 'Interest (1yr)',
			value: `${$selectedProduct.interest || 0}%`,
			dim: true,
			helper: 'Interest is charged in real-time on open positions.'
		},
		{
			label: 'Max Exposure',
			value: `${formatToDisplay($selectedProduct.maxExposure)} ${BASE_SYMBOL}`,
			dim: true,
			helper: 'Maximum long vs short imbalance allowed.'
		},
		{
			label: 'Open Interest Long',
			value: `${formatToDisplay($selectedProduct.openInterestLong)} ${BASE_SYMBOL}`,
			dim: true
		},
		{
			label: 'Open Interest Short',
			value: `${formatToDisplay($selectedProduct.openInterestShort)} ${BASE_SYMBOL}`,
			dim: true
		},
		{
			label: 'Settlement Time',
			value: `${parseInt($selectedProduct.settlementTime/60)}min`,
			dim: true,
			helper: 'Price settles at the next oracle price change or after this time has passed.'
		},
		{
			label: 'Minimum Trade Duration',
			value: `${parseInt($selectedProduct.minTradeDuration/60)}min`,
			dim: true,
			helper: 'Minimum time required to hold your position.'
		},
		{
			label: 'Liquidation Threshold',
			value: `-${$selectedProduct.liquidationThreshold}%`,
			dim: true,
			helper: 'Positions are liquidated when they reach this loss.'
		},
		{
			label: 'Liquidation Bounty',
			value: `${$selectedProduct.liquidationBounty}%`,
			dim: true,
			helper: 'Liquidator bots receive this amount.'
		}
	];

</script>

<style>

	.search-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 115%;
		padding: var(--base-padding);
		border-bottom: 2px solid rgb(55,55,55);
		flex: 1 1 auto;
	}

	.search-row.focused {

	}

	.search-row .clear {
		cursor: pointer;
	}

	:global(.search-row .clear svg) {
		height: 14px;
		width: 14px;
		fill: #fff;
		margin-bottom: -2px;
		pointer-events: none;
	}

	.product-list {
		overflow-y: scroll;
		height: 45vh;
	}

	.no-results {
		color: var(--gray-light);
		padding: var(--base-padding);
		text-align: center;
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
	.row:not(.selected):not(.search-row):hover {
		background-color: rgb(30,30,30);
	}
	.row.selected {
		background-color: rgb(30,30,30);
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
		color: var(--gray-light);
	}
	.price.empty {
		color: var(--gray-light);
	}

	.bottom-container {
		border-top: 2px solid rgb(55,55,55);
		overflow-y: scroll;
		max-height: 30vh;
	}

	.header-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--base-padding);
		border-bottom: 1px solid rgb(30,30,30);
	}

	.header-row .label {
		color: var(--gray-light);
	}

	.header-row .value {
		font-weight: 700;
	}

	.leverage-select {
		border-bottom: 1px solid rgb(30,30,30);
	}

	.leverage-select .header-row {
		border-bottom: none;
	}

	.leverage-select .header-row .value {
		cursor: pointer;
		display: flex;
		align-items: center;
		color: var(--blue);
	}

	:global(.leverage-select .value svg) {
		fill: var(--blue);
		height: 14px;
		width: 14px;
		margin-right: 6px;
	}

	.leverage-select .range {
		padding: var(--base-padding);
	}
	.leverage-select .range.hidden {
		display: none;
	}

</style>

<Modal title='Products' doneButton={true}>

	<div class='search-row' class:focused={searchIsFocused}>
		<input id='search' type='text' bind:value={query} min=0 max=10000000 on:focus={() => {searchIsFocused = true}} on:blur={() => {searchIsFocused = false}} placeholder="Search..." spellcheck="false" autocomplete="off" autocorrect="off">
		{#if query}<span class='clear' on:click={() => {query = undefined}} data-intercept="true">{@html CANCEL_ICON}</span>{/if}
	</div>

	<div class='product-list no-scrollbar'>

		{#if !_productListDisplayed.length}
			<div class='no-results'>No products found.</div>
		{:else}

			{#each _productListDisplayed as product}

				<div class='row' class:selected={product.id == $selectedProductId} on:click={() => {selectProduct(product.id, true)}} data-intercept="true">

					<div class='product-wrap'>
						<img src={LOGOS[product.id]} alt={`${product.symbol} logo`}>
						<span>{product.symbol}</span>
					</div>

					{#if $selectedAddress}
					<div class:empty={!$prices[product.id]} class='price'>{formatToDisplay($prices[product.id]) || 'Tap for price'}</div>
					{/if}

				</div>

			{/each}

		{/if}

	</div>

	{#if $selectedAddress}
	<div class='bottom-container no-scrollbar'>

		<div class='header-row'>
			<div class='label'>Selected Product</div>
			<div class='value'>{$selectedProduct.symbol}</div>
		</div>

		<div class='leverage-select'>
			<div class='header-row'>
				<div class='label'>Leverage<Helper text='Profit or loss multiplier.' direction='right' /></div>
				<div class='value' on:click={toggleRange}>{@html EDIT_ICON} {$leverage}×</div>
			</div>
			<div class:hidden={!rangeShown} class='range'>
				<input type=range bind:value={$leverage} min=1 max={$selectedProduct.maxLeverage * 1 || 100}> 
			</div>
		</div>

		<DataList data={rows} />

	</div>
	{/if}

</Modal>