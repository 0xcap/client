<script>

	import { onMount } from 'svelte'

	import { selectProduct } from '../lib/helpers'
	import { LOGOS } from '../lib/logos'
	import { approveAllowance, submitOrder } from '../lib/methods'
	import { formatToDisplay } from '../lib/utils'

	import { selectedBase } from '../stores/bases'
	import { showModal } from '../stores/modals'
	import { margin, leverage, amount, buyingPower } from '../stores/order'
	import { selectedProductId, selectedProduct } from '../stores/products'
	import { prices } from '../stores/prices'
	import { showToast } from '../stores/toasts'
	import { selectedAddress, userBaseAllowance } from '../stores/wallet'

	let approveIsPending = false;
	async function _approveAllowance() {
		approveIsPending = true;
		const error = await approveAllowance();
		if (error) approveIsPending = false;
	}

	let submitIsPending = false;
	async function _submitOrder(isLong) {
		if (!$amount) return showToast('Amount is required.');
		submitIsPending = true;
		const error = await submitOrder(
			null,
			$selectedProductId,
			isLong,
			$margin * 1,
			$leverage * 1,
			0,
			false
		);
		submitIsPending = false;
	}

	let amountIsFocused = false;

	function checkFocus(address) {
		const elem = document.getElementById('amount');
		if (elem && address) elem.focus();
	}
	$: checkFocus($selectedAddress);

	onMount(() => {
		// Activates prices
		selectProduct($selectedProductId);
		checkFocus($selectedAddress);
	});

</script>

<style>

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: 12px;
		padding: 12px;
		background-color: var(--black-almost);
		border-radius: var(--base-radius);
		box-shadow: rgba(0,200,5,0.1) 0px 12px 28px 0;
	}

	.input-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid rgb(45,45,45);
		border-radius: 14px;
		padding: var(--base-padding);
		background-color: var(--gray-darkest);
		cursor: pointer;
	}

	.input-row:hover, .input-row.focused {
		border-color: var(--gray);
	}

	.sub-label {
		color: var(--gray-light);
		font-size: 80%;
		margin-top: 5px;
	}

	.product-wrap {
		display: flex;
		align-items: center;
		font-size: 22px;
		font-weight: 700;
	}

	.product-wrap img {
		width: 24px;
		height: 24px;
		border-radius: 24px;
	}

	.product-wrap span {
		margin-left: 8px;
	}

	.product-wrap .leverage {
		font-weight: 400;
	}

	.input-wrap {
		flex: 1 1 auto;
	}

	input {
		font-size: 22px;
		font-weight: 700;
		text-align: right;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 12px;
	}

	button {
		padding: var(--base-padding);
		border-radius: 14px;
		color: var(--gray-darkest);
		font-size: 20px;
		font-weight: 700;
	}

	button.disabled {
		background-color: var(--gray-dark);
		color: var(--gray-light);
		pointer-events: none;
		cursor: default;
	}

	.button-default {
		background-color: var(--blue);
		color: var(--gray-darkest);
	}
	.button-default:hover {
		background-color: var(--blue-dark);
	}

	.button-short {
		background-color: var(--red);
	}
	.button-short:hover {
		background-color: var(--red-dark);
	}
	.button-long {
		background-color: var(--green);
	}
	.button-long:hover {
		background-color: var(--green-dark);
	}

</style>

<div class='new-order'>

	<div class='input-row' on:click={() => {showModal('Products')}} data-intercept="true">
		<div class='label-wrap'>
			<div class='label'>Product</div>
			<div class='sub-label'title='Price provided by Chainlink'>
				Price: {formatToDisplay($prices[$selectedProductId]) || ''}
			</div>
		</div>
		<div class='product-wrap'>
			{#if $selectedProduct.symbol}
				<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}>
				<span>{$selectedProduct.symbol}</span>
				<span class='leverage'>{$leverage}x</span>
			{/if}
		</div>
	</div>

	<label class='input-row' class:focused={amountIsFocused} for='amount'>
		<div class='label-wrap'>
			<div class='label'>Amount</div>
			<div class='sub-label'>Available: {formatToDisplay($buyingPower)} {$selectedBase.symbol} <a on:click={() => {amount.set($buyingPower*1)}}>(Max)</a></div>
		</div>
		<div class='input-wrap'>
			<input id='amount' type='number' on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder='0.0' autocomplete="off" autocorrect="off" inputmode="decimal">
		</div>
	</label>

	<div class='buttons'>
		{#if !$selectedAddress}
			<button class='button-disabled'>Connect a wallet</button>
		{:else if $userBaseAllowance == 0}
			<button class:disabled={approveIsPending} class='button-default' on:click={_approveAllowance}>Approve {$selectedBase.symbol}</button>
		{:else}
			<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

</div>