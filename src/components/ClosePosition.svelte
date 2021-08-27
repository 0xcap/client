<script>

	import { onMount } from 'svelte'
	import { submitOrder } from '../lib/methods'
	import { formatToDisplay, intify } from '../lib/utils'

	import Modal from './Modal.svelte'
	
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
		newAmount = data.amount * 1 - amount * 1;
	}

	function checkEntire(_entire) {
		if (_entire) {
			prior_amount = amount;
			amount = data.margin * data.leverage;
		} else {
			amount = prior_amount;
		}
		calculateAmounts();
	}

	$: checkEntire(entire);

	let canSubmit;
	$: canSubmit = amount*1 > 0 && closePercent <= 100 && newAmount >= 0;

	let submitIsPending = false;
	async function _submitOrder() {
		submitIsPending = true;
		await submitOrder(
			data.baseId,
			data.productId,
			!data.isLong,
			(amount*1)/(data.leverage*1),
			1,
			data.id,
			false,
			true
		);
		submitIsPending = false;
	}

	let amountIsFocused = false;
	onMount(() => {
		document.getElementById('amount').focus();
	});

</script>

<style>

	.input-row {
		border-bottom: 1px solid var(--gray-dark);
	}

	.input-row.focused {
		border-color: var(--blue);
	}

	.input-row input {
		padding: var(--base-padding);
	}

	.options {
		border-bottom: 1px solid var(--gray-dark);
	}

	.options label {
		display: flex;
		padding: var(--base-padding);
	}

	.options input {
		margin-right: 8px;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--gray-between);
		padding: var(--base-padding);
	}

	.row:last-child {
		border-bottom: none;
	}

	.label {
		color: var(--gray-light);
	}

	.error {
		color: var(--orange);
	}

	.button-wrap {
		border-top: 1px solid var(--gray-dark);
		padding: var(--base-padding);
	}

	button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: var(--base-padding);
		border-radius: var(--base-radius);
		font-size: 20px;
		font-weight: 700;
		cursor: pointer;
	}
	button:hover {
		background-color: var(--blue-dark);
	}

	button.disabled {
		background-color: var(--gray-dark);
		color: var(--gray-light);
		pointer-events: none;
		cursor: default;
	}

	

</style>

<Modal title='Close Position'>

	<div class='input-row' class:focused={amountIsFocused}>
		<input id='amount' type=number bind:value={amount} min=0 max=10000000 placeholder="Amount to close" on:keyup={calculateAmounts} on:focus={() => {amountIsFocused = true}} on:blur={() => {amountIsFocused = false}}> 
	</div>

	<div class='options'>
		<label class='option' for='entire'>
			<input id='entire' type='checkbox' bind:checked={entire}> Close entire position
		</label>
	</div>

	<div class='details'>
		<div class='row'>
			<div class='label'>Current amount</div>
			<div class='value'>{formatToDisplay(data.amount)}</div>
		</div>
		<div class='row'>
			<div class='label'>Close %</div>
			<div class:error={closePercent * 1 > 100} class='value'>{formatToDisplay(closePercent, 2)}%</div>
		</div>
		<div class='row'>
			<div class='label'>Amount after close</div>
			<div class:error={newAmount * 1 < 0} class='value'>{formatToDisplay(newAmount)}</div>
		</div>
	</div>

	<div class='button-wrap'>
		<button class:disabled={!canSubmit || submitIsPending} on:click={_submitOrder}>Close Position</button>
	</div>

</Modal>