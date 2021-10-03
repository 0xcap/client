<script>

	import { onMount, onDestroy } from 'svelte'

	import Helper from './Helper.svelte'
	import Modal from './Modal.svelte'

	import { setCachedLeverage } from '../lib/utils'

	import { leverage } from '../stores/order'
	import { selectedProduct, selectedProductId } from '../stores/products'
	
	const unsubscribe = leverage.subscribe(value => {
		setCachedLeverage($selectedProductId, value);
	});

	onDestroy(unsubscribe);

</script>

<style>

	.value {
		padding: var(--base-padding);
		font-weight: 800;
		font-size: 130%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.leverage-select .range {
		padding: var(--base-padding);
		padding-top: 0;
	}

</style>

<Modal title='Set Leverage'>

	<div class='leverage-select'>
		<div class='value'>
			{$leverage}×<Helper text='Leverage multiplies your profits and losses.' direction='right' />
		</div>
		<div class='range'>
			<input type=range bind:value={$leverage} min=1 max={$selectedProduct.maxLeverage * 1 || 100}> 
		</div>
	</div>

</Modal>