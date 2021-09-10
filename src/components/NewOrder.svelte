<script>

	import { onMount } from 'svelte'

	import Helper from './Helper.svelte'
	import Volume from './Volume.svelte'


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
	import { selectedAddress, isTestnet, isUnsupported, networkLabel, userBaseBalance } from '../stores/wallet'

	let submitIsPending = false;
	async function _submitOrder(isLong) {
		if (!$amount) {
			checkFocus($selectedAddress);
			return;
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

	.new-order.disabled {
		pointer-events: none;
	}

	.new-order.disabled .input-row {
		opacity: 0.6;
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
		padding: 0 var(--base-padding);
		background-color: var(--gray-darkest);
		cursor: text;
		height: 83px;
	}

	.input-row:hover, .input-row.focused {
		border-color: rgb(55,55,55);
	}

	.amount-row {
		align-items: initial;
		height: 98px !important;
	}

	.amount-row > div {
		flex: 1 1 auto;
	}

	.top {
		margin-top: 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.bottom {
		height: 36px;
		display: flex;
		justify-content: space-between;
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
		white-space: nowrap;
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
		font-size: 135%;
		font-weight: 600;
		text-align: right;
	}

	.input-label {
		color: var(--gray-light);
		font-size: 80%;
		text-align: right;
		margin-top: 5px;
	}

	.input-label.regular {
		color: #fff;
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
		background-color: var(--gray-darkest);
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

	.arbitrum-link {
		display: flex;
		font-size: 90%;
		line-height: 1.35;
	}

	:global(.arbitrum-link img) {
		height: 54px;
		width: 54px;
		margin-right: 8px;
	}

</style>

<div class='new-order' class:disabled={submitIsPending}>

	{#if $selectedAddress && $networkLabel == 'Arbitrum' && $userBaseBalance == 0}
		<div class='arbitrum-link'>
			<div><img src='/img/arbitrum-logo.svg' alt='Arbitrum logo' /></div>
			<div>Arbitrum is a Layer 2 network that works just like Ethereum except it's faster and cheaper. You must first <strong><a href='https://bridge.arbitrum.io' target='_blank'>bridge↗</a></strong> ETH into Arbitrum to start trading on Cap.</div>
		</div>
	{/if}

	<div class='input-row product-row' on:click={() => {showModal('Products')}} data-intercept="true">
		<div class='label-wrap'>
			<div class='label'>Product</div>
			{#if $selectedAddress}
			<div class='sub-label'title='Price provided by Chainlink'>
				Price: {formatToDisplay($prices[$selectedProductId]) || '...'}
			</div>
			{/if}
		</div>
		<div class='product-wrap'>
			{#if $selectedProduct.symbol}
				<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}><span>{$selectedProduct.symbol}</span> <span class='leverage'>{$leverage}×</span>
			{:else}
				<img src={LOGOS[1]} alt={`ETH-USD logo`}><span>ETH-USD</span> <span class='leverage'>20×</span>
			{/if}
		</div>
	</div>

	<label class='input-row amount-row' class:focused={amountIsFocused} for='amount'>

		<div>

			<div class='top'>
				<div class='label-wrap'>
					<div class='label'>Amount<Helper direction='top' text='Enter an amount including leverage.' /></div>
					
				</div>
				<div class='input-wrap'>
					<input id='amount' type='number' on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder={`0 ${BASE_SYMBOL}`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={submitIsPending}>
					
				</div>
			</div>

			<div class='bottom'>

				<div class='sub-label'>
					Available: <a on:click={() => {amount.set(Math.floor($buyingPower*10**4)/10**4)}}>{formatToDisplay($buyingPower)} {BASE_SYMBOL}</a>
				</div>

				<div>
					<div class:regular={$margin > 0} class='input-label'>${formatToDisplay($prices[1] * $amount, 2)}</div>
					{#if $margin > 0}
					<div class='input-label'><Helper direction='top' text='Actual balance used from your wallet.' /> Margin: {formatToDisplay($margin, 4)} {BASE_SYMBOL}</div>
					{/if}
				</div>

			</div>

		</div>

	</label>

	<div class='buttons'>
		{#if !$selectedAddress}
			<button class='disabled'>Connect a wallet</button>
		{:else if $isUnsupported}
			<button class='disabled'>Switch to Arbitrum to trade</button>
		{:else}
			<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

	<Volume/>

</div>
