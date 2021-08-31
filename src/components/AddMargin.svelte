<script>

	import { PRICE_DECIMALS } from '../lib/constants'
	import { calculateLiquidationPrice } from '../lib/helpers'
	import { submitOrder } from '../lib/methods'
	import { formatToDisplay, intify } from '../lib/utils'
	
	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
	import ModalButton from './ModalButton.svelte'

	export let data;

	let margin;

	let newMargin = 0, newLeverage = 0, newLiquidationPrice = 0;

	async function calculateAmounts() {
		if (!margin*1) {
			newMargin = 0;
			newLeverage = 0;
			newLiquidationPrice = 0;
			return;
		}
		newMargin = data.margin * 1 + margin * 1;
		newLeverage = 1 * data.leverage * data.margin / newMargin;
		newLiquidationPrice = await calculateLiquidationPrice({
			productId: data.productId,
			leverage: newLeverage,
			margin: newMargin,
			price: data.price,
			isLong: data.isLong
		});
		newLiquidationPrice = newLiquidationPrice.toFixed(PRICE_DECIMALS);
	}

	let canSubmit;
	$: canSubmit = margin * 1 > 0 && newMargin * 1 > 0 && newLeverage * 1 >= 1 && newLiquidationPrice * 1 >= 0;

	let submitIsPending = false;
	async function _submitOrder() {
		submitIsPending = true;
		const error = await submitOrder(
			data.baseId,
			data.productId,
			data.isLong,
			margin,
			1,
			data.positionId,
			false,
			false
		);
		submitIsPending = false;
	}

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Margin to Add',
			onKeyUp: calculateAmounts
		},
		{
			label: 'Current Margin',
			value: formatToDisplay(data.margin)
		},
		{
			label: 'New Margin',
			value: formatToDisplay(newMargin),
			hasError: !(newMargin*1)
		},
		{
			label: 'New Leverage',
			value: formatToDisplay(intify(newLeverage)),
			hasError: newLeverage * 1 < 1
		},
		{
			label: 'New Liquidation Price',
			value: formatToDisplay(newLiquidationPrice),
			hasError: newLiquidationPrice * 1 <= 0
		},
	];

</script>

<style>
</style>

<Modal title='Add Margin'>
	<DataList data={rows} bind:value={margin} />
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} action={_submitOrder} label='Add Margin' />
</Modal>