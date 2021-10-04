<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'

	import { selectProduct } from '../lib/helpers'
	import { CANCEL_ICON } from '../lib/icons'
	import { LOGOS } from '../lib/logos'
	import { formatToDisplay, setCachedLeverage, shortSymbol } from '../lib/utils'
	
	import { hideModal } from '../stores/modals'
	import { prices } from '../stores/prices'
	import { selectedProductId, selectedProduct, productList } from '../stores/products'

	let searchIsFocused = false;

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

</script>

<style>

	.search-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--gray);
		flex: 1 1 auto;
		padding-right: var(--base-padding);
	}
	.search-row input {
		padding: var(--base-padding);
		padding-right: 0;
		font-size: 120%;
	}

	.search-row .clear {
		cursor: pointer;
	}

	:global(.search-row .clear svg) {
		height: 12px;
		width: 12px;
		fill: var(--gray-light);
		margin-bottom: -2px;
		pointer-events: none;
	}

	.product-list {
		overflow-y: scroll;
		height: 80vh;
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
		border-bottom: 1px solid var(--eerie-black);
		font-size: 140%;
		font-weight: 700;
		cursor: pointer;
	}
	.row:not(.selected):not(.search-row):hover {
		background-color: var(--gray);
	}
	.row.selected {
		background-color: var(--gray);
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

</style>

<Modal title='Select Product'>

	<div class='search-row' class:focused={searchIsFocused}>
		<input id='search' type='text' bind:value={query} min=0 max=10000000 on:focus={() => {searchIsFocused = true}} on:blur={() => {searchIsFocused = false}} placeholder="Search..." spellcheck="false" autocomplete="off" autocorrect="off">
		{#if query}<span class='clear' on:click={() => {query = undefined}} data-intercept="true">{@html CANCEL_ICON}</span>{/if}
	</div>

	<div class='product-list no-scrollbar'>

		{#if !_productListDisplayed.length}
			<div class='no-results'>No products found.</div>
		{:else}

			{#each _productListDisplayed as product}

				<div class='row' class:selected={product.id == $selectedProductId} on:click={() => {selectProduct(product.id, true); hideModal()}} data-intercept="true">

					<div class='product-wrap'>
						<img src={LOGOS[product.id]} alt={`${product.symbol} logo`}>
						<span>{shortSymbol(product.symbol)}</span>
					</div>

					<div class:empty={!$prices[product.id]} class='price'>{formatToDisplay($prices[product.id])}</div>

				</div>

			{/each}

		{/if}

	</div>

</Modal>