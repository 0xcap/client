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
		background-color: var(--less-black);
		border-radius: var(--base-radius);
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
		border-top: 1px solid var(--gray);
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
		color: var(--gray-light);
	}

	.bottom .price-change {

	}

	.bottom .margin-used {
		margin-right: 12px;
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
		background-color: var(--gray);
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

	button {
		padding: 0 var(--base-padding);
		height: 64px;
		border-radius: var(--base-radius);
		color: var(--less-black);
		font-weight: 700;
		font-size: 125%;
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
		color: #3D1300;/*#521A00;*/
		background-color: var(--red);
	}
	.button-short:not(.disabled):hover {
		color: #521A00;

	}
	.button-long {
		color: #003D01;/*#005201;*/
		background-color: var(--green);
	}
	.button-long:not(.disabled):hover {
		color: #005201;

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
					<Helper direction='top' marginRight={true} text='Reference price. Your trade execution price may differ.' />
					<div class='price' class:empty={!$prices[$selectedProductId]}>{formatToDisplay($prices[$selectedProductId], 0, true) || '--'}</div>
					<div class={`price-change ${$prices[$selectedProductId] >= $open24h[$selectedProductId]  ? 'pos' : 'neg'}`}>{displayPricePercentChange($prices[$selectedProductId], $open24h[$selectedProductId])}</div>
				</div>

				<div class='right'>
					
					{#if $margin > 0}
						
						<Helper direction='top' text='The actual amount used from your wallet for this trade (your margin).' marginRight={true} />
						<div class='margin-used'>{formatToDisplay($margin, 4)} {BASE_SYMBOL}</div>
						
						<Helper direction='top' text='Your trade size in USD, equal to your margin times the selected leverage.' marginRight={true} />
						<div class='trade-size'>${formatToDisplay($prices[1] * $amount, 2)}</div>

					{:else}

						<Helper direction='top' text='Amount available to trade, equal to your wallet balance times leverage.' marginRight={true} />

						<a on:click={() => {amount.set(Math.floor($buyingPower*10**4)/10**4)}}>{formatToDisplay($buyingPower)} {BASE_SYMBOL}</a>
					
					{/if}
				
				</div>

			</div>

		</div>

		<div class='buttons'>
			{#if !$selectedAddress}
				<button class='button-default' on:click={connectWallet}>Connect a Wallet</button>
			{:else if $isUnsupported}
				<button class='disabled'>Switch to Arbitrum to trade</button>
			{:else}
				<button class:disabled={submitIsPending} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
			{/if}
		</div>

	</div>

</div>
