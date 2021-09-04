<script>

	import { onMount } from 'svelte'

	import { BASE_SYMBOL } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { LOGOS } from '../lib/logos'
	import { openPosition } from '../lib/methods'
	import { formatToDisplay } from '../lib/utils'

	import { showModal } from '../stores/modals'
	import { margin, leverage, amount, buyingPower } from '../stores/order'
	import { selectedProductId, selectedProduct } from '../stores/products'
	import { prices } from '../stores/prices'
	import { showToast } from '../stores/toasts'
	import { selectedAddress, isTestnet, isUnsupported } from '../stores/wallet'

	let submitIsPending = false;
	async function _submitOrder(isLong) {
		if (!$amount) {
			checkFocus($selectedAddress);
			return showToast('Amount is required.');
		}
		submitIsPending = true;
		const error = await openPosition(
			$selectedProductId,
			isLong,
			$leverage * 1,
			$margin * 1
		);
		submitIsPending = false;
		if (error) {
			checkFocus($selectedAddress);
		} else {
			amount.set();
		}
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
	}

	.product-row {
		cursor: pointer !important;
	}

	.input-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid rgb(45,45,45);
		border-radius: 14px;
		padding: var(--base-padding);
		background-color: var(--gray-darkest);
		cursor: text;
	}

	.input-row:hover, .input-row.focused {
		border-color: rgb(55,55,55);
	}

	.label {
		font-weight: 600;
	}

	.sub-label {
		color: var(--gray-light);
		font-size: 80%;
		margin-top: 5px;
	}

	.product-wrap {
		display: flex;
		align-items: center;
		font-size: 115%;
		font-weight: 800;
	}

	.product-wrap img {
		width: 32px;
		height: 32px;
		border-radius: 32px;
		margin-right: 10px;
	}

	.product-wrap .leverage {
		margin-left: 3px;
		font-weight: 400;
	}

	.input-wrap {
		position: relative;
		flex: 1 1 auto;
	}

	input {
		font-size: 22px;
		font-weight: 600;
		text-align: right;
	}

	.input-label {
		position: absolute;
		bottom: -17px;
		right: 0;
		color: rgba(70,70,70);
		font-size: 80%;
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
		font-weight: 650;
		font-size: 115%;
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
	.button-default:not(.disabled):hover {
		background-color: var(--blue-dark);
	}

	.button-short {
		background-color: var(--red);
	}
	.button-short:not(.disabled):hover {
		background-color: var(--red-dark);
	}
	.button-long {
		background-color: var(--green);
	}
	.button-long:not(.disabled):hover {
		background-color: var(--green-dark);
	}

</style>

<div class='new-order'>

	<div class='input-row product-row' on:click={() => {showModal('Products')}} data-intercept="true">
		<div class='label-wrap'>
			<div class='label'>Product</div>
			<div class='sub-label'title='Price provided by Chainlink'>
				Price: {formatToDisplay($prices[$selectedProductId]) || ''}
			</div>
		</div>
		<div class='product-wrap'>
			{#if $selectedProduct.symbol}
				<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}><span>{$selectedProduct.symbol}</span> <span class='leverage'>{$leverage}x</span>
			{/if}
		</div>
	</div>

	<label class='input-row' class:focused={amountIsFocused} for='amount'>
		<div class='label-wrap'>
			<div class='label'>Amount</div>
			<div class='sub-label'>
				Available: {formatToDisplay($buyingPower)} {BASE_SYMBOL}
				{#if $selectedAddress}
					<a on:click={() => {amount.set($buyingPower*1)}}>(Max)</a>
				{/if}
			</div>
		</div>
		<div class='input-wrap'>
			<input id='amount' type='number' on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder={`0 ${BASE_SYMBOL}`} autocomplete="off" autocorrect="off" inputmode="decimal">
			{#if $margin > 0}<div class='input-label'>Margin: {formatToDisplay($margin)} {BASE_SYMBOL}</div>{/if}
		</div>
	</label>

	<div class='buttons'>
		{#if !$selectedAddress}
			<button class='disabled'>Connect a wallet</button>
		{:else if $isUnsupported}
			<button class='disabled'>Switch to Rinkeby to trade</button>
		{:else}
			<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

</div>