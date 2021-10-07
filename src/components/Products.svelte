<script>

	import Modal from './Modal.svelte'

	import { selectProduct } from '../lib/helpers'
	import { LOGOS } from '../lib/logos'
	import { shortSymbol } from '../lib/utils'
	
	import { hideModal } from '../stores/modals'
	import { selectedProductId, selectedProduct, productList } from '../stores/products'

</script>

<style>

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
		border-bottom: 1px solid var(--jet-dim);
		font-size: 120%;
		font-weight: 700;
		cursor: pointer;
	}
	.row:not(.selected):not(.search-row):hover {
		background-color: var(--jet);
	}
	.row.selected {
		background-color: var(--jet);
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

</style>

<Modal title='Select Product' noHeader={true}>

	{#each $productList as product}

		<div class='row' class:selected={product.id == $selectedProductId} on:click={() => {selectProduct(product.id, true); hideModal()}} data-intercept="true">

			<div class='product-wrap'>
				<img src={LOGOS[product.id]} alt={`${product.symbol} logo`}>
				<span>{shortSymbol(product.symbol)}</span>
			</div>

		</div>

	{/each}

</Modal>