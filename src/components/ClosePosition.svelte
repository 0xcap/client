<script>

	import { submitOrder } from '../lib/methods'
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
		amount = data.margin * data.leverage;
		calculateAmounts();
	}

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _submitOrder() {
		if (closePercent >= 100) {
			marginToSubmit = data.margin * 1;
		} else {
			marginToSubmit = (amount*1)/(data.leverage*1);
		}
		submitIsPending = true;
		await submitOrder(
			data.baseId,
			data.productId,
			!data.isLong,
			marginToSubmit,
			1,
			data.id,
			false,
			true
		);
		submitIsPending = false;
	}

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount to Close',
			onKeyUp: calculateAmounts,
			labelTool: {
				text: '(Max)', 
				action: setMaxAmount
			}
		},
		{
			label: 'Current Amount',
			value: formatToDisplay(data.amount)
		},
		{
			label: 'Close %',
			value: `${formatToDisplay(closePercent, 2)}%`
		},
		{
			label: 'Amount After Close',
			value: formatToDisplay(newAmount)
		},
	];

</script>

<style>

</style>

<Modal title='Close Position'>
	<DataList data={rows} bind:value={amount} />
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} action={_submitOrder} label='Close Position' />
</Modal>