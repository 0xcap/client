<script>

	import { onMount } from 'svelte'

	import Helper from './Helper.svelte'
	import Volume from './Volume.svelte'


	import { BASE_SYMBOL } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { LOGOS } from '../lib/logos'
	import { submitNewPosition } from '../lib/methods'
	import { formatToDisplay, displayPricePercentChange } from '../lib/utils'
	import { connectWallet } from '../lib/wallet'

	import { showModal } from '../stores/modals'
	import { margin, leverage, amount, buyingPower } from '../stores/order'
	import { selectedProductId, selectedProduct } from '../stores/products'
	import { prices, open24h } from '../stores/prices'
	import { showToast } from '../stores/toasts'
	import { selectedAddress, isTestnet, isUnsupported, networkLabel, userBaseBalance } from '../stores/wallet'

	let submitIsPending = false;
	async function _submitOrder(isLong) {
		if (!$amount) {
			checkFocus($selectedAddress);
			return;
		}
		submitIsPending = true;
		const error = await submitNewPosition(
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

	let showArbitrumLink = false;
	let first_call = true;
	function checkArbitrumLink(address, balance, isUnsupported) {
		if (first_call) {
			first_call = false;
			return;
		}
		if (isUnsupported || address && balance == 0 || !address && !balance) {
			showArbitrumLink = true;
		} else {
			showArbitrumLink = false;
		}
	}

	onMount(() => {
		// Activates prices
		selectProduct($selectedProductId);
		checkFocus($selectedAddress);

		setTimeout(() => {
			checkArbitrumLink($selectedAddress, $userBaseBalance, $isUnsupported);
		}, 750);
	});

	$: checkArbitrumLink($selectedAddress, $userBaseBalance, $isUnsupported);

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
		border-radius: 14px;
		padding: 0 var(--base-padding);
		background-color: rgb(32,32,32);
		height: 86px;
	}

	.input-row:hover, .input-row.focused {
		border-color: rgb(55,55,55);
	}

	.left {
		display: flex;
		align-items: center;
	}

	.right {
		flex: 1 1 auto;
		text-align: right;
	}

	.left .column:first-child {
		margin-right: 10px;
	}

	.column .top {
		display: flex;
		align-items: center;
		height: 32px;
		font-weight: 800;
		font-size: 130%;
	}

	.column .bottom {
		margin-top: 10px;
		color: var(--gray-light);
		font-size: 80%;
	}

	.select-leverage {
		color: var(--blue);
		cursor: pointer;
		font-weight: 400 !important;
	}

	.product-wrap {
		display: flex;
		align-items: center;
		white-space: nowrap;
		cursor: pointer;
	}

	.product-wrap img {
		width: 32px;
		height: 32px;
		border-radius: 32px;
		margin-right: 10px;
	}

	.input-wrap {
		position: relative;
		flex: 1 1 auto;
	}

	input {
		font-size: inherit;
		font-weight: 600;
		text-align: right;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		grid-gap: 12px;
	}

	button {
		padding: 0 var(--base-padding);
		height: 58px;
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
		line-height: 1.45;
		padding: 6px 0;
	}

	:global(.arbitrum-link img) {
		height: 54px;
		width: 54px;
		margin-right: 8px;
	}

</style>

<div class='new-order' class:disabled={submitIsPending}>

	{#if showArbitrumLink}
		<div class='arbitrum-link'>
			<div><img src='/img/arbitrum-logo.svg' alt='Arbitrum logo' /></div>
			<div>Arbitrum is a Layer 2 network that works just like Ethereum except it's faster and cheaper. You must first <strong><a href='https://bridge.arbitrum.io' target='_blank'>bridge↗</a></strong> ETH into Arbitrum to start trading on Cap.</div>
		</div>
	{/if}


	<div class='input-row' class:focused={amountIsFocused}>

		<div class='left'>

			<div class='column'>
				<div class='top' on:click={() => {showModal('Products')}} data-intercept="true">
					<div class='product-wrap'>
						{#if $selectedProduct.symbol}
							<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}><span>{$selectedProduct.symbol}</span>
						{:else}
							<img src={LOGOS[1]} alt={`ETH-USD logo`}><span>ETH-USD</span>
						{/if}
					</div>
				</div>
				<div class='bottom'>
					{formatToDisplay($prices[$selectedProductId]) || '...'} {displayPricePercentChange($prices[$selectedProductId], $open24h[$selectedProductId])}
				</div>
			</div>

			<div class='column'>
				<div class='top select-leverage' on:click={() => {showModal('Leverage')}} data-intercept="true">
					{#if $selectedProduct.symbol}
						{$leverage}×
					{:else}
						20×
					{/if}
				</div>
				<div class='bottom'>
					&nbsp;
				</div>
			</div>

		</div>

		<div class='right'>

			<div class='column'>
				<div class='top'>
					<input id='amount' type='number' on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder={`0 ${BASE_SYMBOL}`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={submitIsPending}>
				</div>
				<div class='bottom'>
					{#if $margin > 0}
						<Helper direction='top' text='The actual amount debited from your wallet for this trade (margin).' />{formatToDisplay($margin, 4)} {BASE_SYMBOL} <Helper direction='top' text='Your trade size in USD, equal to margin times leverage.' />${formatToDisplay($prices[1] * $amount, 2)}
					{:else}
						<Helper direction='top' text='Amount available to trade, equal to your wallet balance times leverage.' /><a on:click={() => {amount.set(Math.floor($buyingPower*10**4)/10**4)}}>{formatToDisplay($buyingPower)} {BASE_SYMBOL}</a>
					{/if}
				</div>
			</div>

		</div>

	</div>

	<div class='buttons'>
		{#if !$selectedAddress}
			<button on:click={connectWallet}>Connect a wallet</button>
		{:else if $isUnsupported}
			<button class='disabled'>Switch to Arbitrum to trade</button>
		{:else}
			<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

	<Volume/>

</div>
