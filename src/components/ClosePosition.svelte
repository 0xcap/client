<script>

	import { BASE_SYMBOL } from '../lib/constants'
	import { closePosition } from '../lib/methods'
	import { formatToDisplay, intify } from '../lib/utils'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
	import ModalButton from './ModalButton.svelte'
	
	export let data;

	let amount;
	let entire = false;

	let prior_amount;

	let closePercent = 0, newAmount = data.amount;

	function calculateAmounts() {
		if (!amount*1) {
			closePercent = 0;
			newAmount = data.amount;
			return;
		}
		closePercent = 100 * amount * 1 / (data.amount * 1);
		if (closePercent > 100) closePercent = 100;
		newAmount = data.amount * 1 - amount * 1;
		if (newAmount < 0) newAmount = 0;
	}

	function setMaxAmount(_entire) {
		amount = formatToDisplay(data.margin * data.leverage);
		calculateAmounts();
	}

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _submitOrder() {
		let marginToSubmit;
		if (closePercent >= 100) {
			marginToSubmit = data.margin * 1.01;
		} else {
			marginToSubmit = (amount*1)/(data.leverage*1);
		}
		submitIsPending = true;
		const error = await closePosition(
			data.positionId,
			marginToSubmit,
			amount,
			false,
			data.productId,
			closePercent >= 100
		);
		submitIsPending = false;
	}

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount to Close',
			onKeyUp: calculateAmounts
		},
		{
			label: 'Current Amount',
			value: `${formatToDisplay(data.amount)} ${BASE_SYMBOL}`,
			dim: true,
			onclick: setMaxAmount
		},
		{
			label: 'Close Percent',
			value: `${formatToDisplay(closePercent, 2)}%`,
			isEmpty: closePercent == 0
		},
		{
			label: 'Amount after Close',
			value: `${formatToDisplay(newAmount)} ${BASE_SYMBOL}`,
			isEmpty: newAmount * 1 == data.amount * 1
		},
	];

</script>

<style>

</style>

<Modal title='Close Position'>
	<DataList data={rows} bind:value={amount} />
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} action={_submitOrder} label='Close Position' />
</Modal>