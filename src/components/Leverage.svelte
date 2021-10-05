<script>

	import { onMount, onDestroy } from 'svelte'

	import Helper from './Helper.svelte'
	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { calculateLiquidationPrice } from '../lib/helpers'
	import { setCachedLeverage, formatToDisplay, displayPricePercentChange } from '../lib/utils'

	import { leverage } from '../stores/order'
	import { prices } from '../stores/prices'
	import { selectedProduct, selectedProductId } from '../stores/products'

	let maxLeverage;
	$: maxLeverage = $selectedProduct.maxLeverage * 1 || 100

	$: handleChange($leverage);

	function handleChange(_leverage) {
		if (!_leverage || !maxLeverage) return;
		setCachedLeverage($selectedProductId, _leverage);
		const elem = document.getElementById('range');
		if (!elem) return;
		const percent = 100 * _leverage * 1 / maxLeverage * 1;
		elem.style.filter = `hue-rotate(-${percent}deg)`;
	}

	let liquidationPriceShort, liquidationPriceLong;
	function calcLiqPrices(_leverage, price) {
		liquidationPriceShort = calculateLiquidationPrice({
			productId: $selectedProductId,
			price,
			leverage: _leverage,
			isLong: false
		});
		liquidationPriceLong = calculateLiquidationPrice({
			productId: $selectedProductId,
			price,
			leverage: _leverage,
			isLong: true
		});
	}

	$: calcLiqPrices($leverage, $prices[$selectedProductId]);
	
	onMount(() => {
		handleChange($leverage);
	});

	let rows;
	$: rows = [
		{
			label: 'Liquidation Price (Long)',
			value: `~${formatToDisplay(liquidationPriceLong, 0, true)} (${displayPricePercentChange(liquidationPriceLong, $prices[$selectedProductId])})`
		},
		{
			label: 'Liquidation Price (Short)',
			value: `~${formatToDisplay(liquidationPriceShort, 0, true)} (${displayPricePercentChange(liquidationPriceShort, $prices[$selectedProductId])})`
		}
	];

</script>

<style>

	.value {
		padding: var(--base-padding);
		font-weight: 600;
		font-size: 200%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.range-container {
		padding: var(--base-padding);
		padding-top: 0;
	}

	.range {
		-webkit-appearance: none;
		appearance: none;
		background: var(--gray);
		outline: none;
		border: none;
		height: 20px;
		border-radius: var(--base-radius);
		max-width: 100%;
		overflow: hidden;
		transition: box-shadow 0.6s ease-in-out;
	}

	.range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		cursor: ew-resize;
		background: var(--gray-light);
		border: 3px solid var(--gray);
		box-shadow: -407px 0 0 400px var(--green);
	}
	/*, .range::-moz-range-thumb, .range::-ms-thumb*/

	.details {

	}

</style>

<Modal title='Select Leverage' doneButton={true}>

	<div class='leverage-select'>
		<div class='value'>
			{$leverage}×
		</div>
		<div class='range-container'>
			<input class='range' id='range' type=range bind:value={$leverage} min=1 max={maxLeverage}> 
		</div>
		<div class='details'>
			<DataList data={rows} />
		</div>
	</div>

</Modal>