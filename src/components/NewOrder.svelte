<script>

	import { onMount } from 'svelte'

	import Helper from './Helper.svelte'


	import { BASE_SYMBOL } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { CARET_DOWN } from '../lib/icons'
	import { LOGOS } from '../lib/logos'
	import { submitNewPosition } from '../lib/methods'
	import { formatToDisplay, displayPricePercentChange, shortSymbol } from '../lib/utils'
	import { connectWallet } from '../lib/wallet'

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

	.arbitrum-link {
		display: flex;
		font-size: 90%;
		line-height: 1.45;
		padding-bottom: 40px;
	}

	:global(.arbitrum-link img) {
		height: 54px;
		width: 54px;
		margin-right: 12px;
	}

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
		padding: var(--base-padding);
		background-color: var(--eerie-black);
		border-radius: var(--base-radius);
	}

	@media (max-width: 600px) {
		.new-order {
			grid-gap: 12px;
			padding: 12px;
		}
	}

	.new-order.disabled {
		pointer-events: none;
	}

	.new-order.disabled .input-row {
		opacity: 0.6;
	}

	.new-order a {
		color: inherit;
	}

	.product-row {
		cursor: pointer !important;
	}

	.input-row {
		border-radius: var(--base-radius);
	}

	.input-row.focused {
	}

	.top {
		display: flex;
		align-items: center;
		height: 48px;
		font-weight: 700;
		font-size: 125%;
	}

	.bottom {
		margin-top: var(--base-padding);
		padding-top: var(--base-padding);
		display: flex;
		align-items: center;
		border-top: 1px solid var(--jet-dim);
		font-size: 90%;
	}

	@media (max-width: 600px) {
		.bottom {
			margin-top: 12px;
			padding-top: 12px;
		}
	}

	.left {
		display: flex;
		align-items: center;
	}

	.left .helper {
		margin-right: 6px;
	}

	.bottom .price {
		margin-right: 6px;
	}
	.bottom .price.empty {
		color: var(--dim-gray);
	}

	.bottom .price-change {

	}

	.bottom .margin-used {
		margin-right: 12px;
		border-bottom: 1px dashed var(--dim-gray);
	}

	.bottom .trade-size {
		border-bottom: 1px dashed var(--dim-gray);
	}

	.sep {
		color: var(--jet);
		margin: 0 12px;
	}

	.right {
		flex: 1 1 auto;
		text-align: right;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.right .helper {
		margin-left: 6px;
	}

	.selector {
		display: flex;
		align-items: center;
		background-color: var(--jet);
		border-radius: var(--base-radius);
		white-space: nowrap;
		cursor: pointer;
		padding: 10px 12px;
	}

	.selector:hover {
		background-color: var(--onyx);
	}

	:global(.selector svg) {
		margin-left: 12px;
		height: 8px;
		fill: inherit;
		stroke: inherit;
	}

	.product-wrap {
		margin-right: 12px;
	}

	.product-wrap img {
		width: 28px;
		height: 28px;
		border-radius: 28px;
		margin-right: 12px;
	}

	@media (max-width: 600px) {
		.selector {
			padding: 10px 8px;
		}
		.product-wrap {
			margin-right: 6px;
		}
	}

	.select-leverage {
		font-weight: 500;
	}

	input {
		flex: 1 1 auto;
		font-weight: 500;
		text-align: right;
		font-size: 125%;
	}

	.buttons {
		display: grid;
		grid-auto-flow: column;
		grid-gap: var(--semi-padding);
	}

	@media (max-width: 600px) {
		.buttons {
			grid-gap: 12px;
		}
	}

	button {
		padding: 0 var(--base-padding);
		height: 64px;
		border-radius: var(--base-radius);
		color: var(--less-black);
		font-weight: 700;
		font-size: 120%;
	}

	@media (max-width: 600px) {
		button {
			height: 58px;
			font-size: 110%;
		}
	}

	button.disabled {
		background-color: var(--gray-darkest);
		color: var(--gray-light);
		pointer-events: none;
		cursor: default;
	}

	.button-short {
		color: var(--red-dark);
		background-color: var(--red);
	}
	.button-short:not(.disabled):hover {
		background-color: var(--red-dim);
	}
	.button-long {
		color: var(--green-dark);
		background-color: var(--green);
	}
	.button-long:not(.disabled):hover {
		background-color: var(--green-dim);

	}

</style>

<div>

	{#if showArbitrumLink}
		<div class='arbitrum-link'>
			<div><img src='/img/arbitrum-logo.svg' alt='Arbitrum logo' /></div>
			<div>Arbitrum is a Layer 2 network that works just like Ethereum except it's faster and cheaper. You must first <strong><a href='https://bridge.arbitrum.io' target='_blank'>bridge↗</a></strong> ETH into Arbitrum to start trading on Cap.</div>
		</div>
	{/if}

	<div class='new-order' class:disabled={submitIsPending}>

		<div class='input-row' class:focused={amountIsFocused}>

			<div class='top'>

				<div class='selector product-wrap' on:click={() => {showModal('Products')}} data-intercept="true">
					{#if $selectedProduct.symbol}
						<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}>
					{:else}
						<img src={LOGOS[1]} alt={`ETH-USD logo`}><span>ETH</span>
					{/if}
					<span>{shortSymbol($selectedProduct.symbol)}</span>
					{@html CARET_DOWN}
				</div>

				<div class='selector select-leverage' on:click={() => {showModal('Leverage')}} data-intercept="true">
					{#if $selectedProduct.symbol}
						<span>{$leverage}×</span>
					{:else}
						<span>20×</span>
					{/if}{@html CARET_DOWN}
				</div>

				<input id='amount' type='number' on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={submitIsPending}>

			</div>

			<div class='bottom'>

				<div class='left'>
					<Helper title='Reference Price' text="Execution price differs based on market conditions." label={formatToDisplay($prices[$selectedProductId], 0, true) || null} />
				</div>

				<div class='right'>
					
					{#if $margin > 0}
						
						<Helper title='Margin' text='Balance used for this trade.' label={`${formatToDisplay($margin, 4)} ${BASE_SYMBOL}`} />
						<div class='sep'>|</div>
						<Helper title='Trade Size (USD)' text='Margin × leverage.' small={true} label={`$${formatToDisplay($prices[1] * $amount, 2)}`} />

					{:else}

						<Helper title='Buying Power' text='Wallet balance × leverage.' label={`${formatToDisplay($buyingPower)} ${BASE_SYMBOL}`}/>
	
					{/if}
				
				</div>

			</div>

		</div>

		<div class='buttons'>
			{#if !$selectedAddress}
				<button class='button-long' on:click={connectWallet}>Connect a Wallet</button>
			{:else if $isUnsupported}
				<button class='disabled'>Switch to Arbitrum to trade</button>
			{:else}
				<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
			{/if}
		</div>

	</div>

</div>
