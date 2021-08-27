<script>

	/*
	TODO:
	-- position UPL should include fee
	- refactor modal elements into components: Input wrap, details, button
	- toasts on tx completion
	- add margin / close error if still settling
	- wallet balance in account modal
	- tx icon
	- tooltips?
	- footer: hosted on IPFS
	- keeper on vercel, called by github actions shouldn't submit transaction if they already did for the given IDs (pending tx on same set of IDs)
	- logos should be links not base64
	- more products
	- sounds

	*/

	import { onMount } from 'svelte'
	import { PRICE_DECIMALS } from '../lib/constants'
	import { calculateLiquidationPrice } from '../lib/helpers'
	import { submitOrder } from '../lib/methods'
	import { formatToDisplay, intify } from '../lib/utils'
	
	import Modal from './Modal.svelte'

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
			data.id,
			false,
			false
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

	input {
		padding: var(--base-padding);
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

<Modal title='Add Margin'>
	<div class='input-row' class:focused={amountIsFocused}>
		<input id='amount' type=number bind:value={margin} min=0 max=10000000 placeholder="Margin to add" on:keyup={calculateAmounts} on:focus={() => {amountIsFocused = true}} on:blur={() => {amountIsFocused = false}}> 
	</div>
	<div class='details'>
		<div class='row'>
			<div class='label'>Current margin</div>
			<div class='value'>{formatToDisplay(data.margin)}</div>
		</div>
		<div class='row'>
			<div class='label'>New margin</div>
			<div class:error={!newMargin*1} class='value'>{formatToDisplay(newMargin)}</div>
		</div>
		<div class='row'>
			<div class='label'>New Leverage</div>
			<div class:error={newLeverage * 1 < 1} class='value'>{formatToDisplay(intify(newLeverage))}</div>
		</div>
		<div class='row'>
			<div class='label'>New Liquidation Price</div>
			<div class:error={newLiquidationPrice * 1 <= 0} class='value'>{formatToDisplay(newLiquidationPrice)}</div>
		</div>
	</div>
	<div class='button-wrap'>
		<button class:disabled={!canSubmit || submitIsPending} on:click={_submitOrder}>Add Margin</button>
	</div>
</Modal>