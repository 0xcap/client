<script>

	import { onMount } from 'svelte'

	import Helper from './Helper.svelte'
	import Chart from './Chart.svelte'

	import { BASE_SYMBOL } from '../lib/constants'
	import { selectProduct } from '../lib/helpers'
	import { CARET_DOWN } from '../lib/icons'
	import { LOGOS } from '../lib/logos'
	import { submitNewPosition } from '../lib/methods'
	import { formatToDisplay, shortSymbol } from '../lib/utils'

	import { showModal } from '../stores/modals'
	import { margin, leverage, amount, buyingPower } from '../stores/order'
	import { prices } from '../stores/prices'
	import { selectedProductId, selectedProduct, products } from '../stores/products'
	import { showToast } from '../stores/toasts'
	import { selectedAddress, isUnsupported, userBaseBalance } from '../stores/wallet'

	let show_chart = false;
	if (localStorage.getItem('show_chart')) show_chart = true;

	function toggleChart() {
		show_chart = !show_chart;
		if (show_chart) {
			localStorage.setItem('show_chart', true);
		} else {
			localStorage.removeItem('show_chart');
		}
	}

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
		if (!address || isUnsupported) {
			showArbitrumLink = false;
			return;
		}
		if (!isUnsupported && address && balance === 0) {
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
		}, 1000);
	});

	$: checkArbitrumLink($selectedAddress, $userBaseBalance, $isUnsupported);

</script>

<style>

	.arbitrum-link {
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1.4;
		background-color: var(--jet-dim);
		padding: var(--base-padding);
		border-radius: var(--base-radius);
		margin-bottom: 60px;
		font-weight: 600;
	}

	:global(.arbitrum-link img) {
		height: 32px;
		width: 32px;
		margin-right: 10px;
	}

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
		padding: var(--base-padding);
		background-color: var(--jet-dim);
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
		border-top: 1px solid var(--jet);
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

	.chart-toggle {
		margin-left: 12px;
		color: var(--sonic-silver);
		cursor: pointer;
		border-bottom: 1px solid transparent;
	}
	.chart-toggle.active {
		color: #fff;
	}

	.right {
		flex: 1 1 auto;
		text-align: right;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.right > :global(div) {
		margin-left: 12px;
	}

	.selector {
		display: flex;
		align-items: center;
		background-color: var(--onyx-dim);
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
		fill: transparent;
		stroke: #fff;
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
		background-color: var(--jet);
		color: var(--dim-gray);
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
			<img src='/img/arbitrum-logo.svg' alt='Arbitrum logo' />
			<div><strong><a href='https://bridge.arbitrum.io' target='_blank'>Bridge↗</a></strong> ETH into Arbitrum to start trading.</div>
		</div>
	{/if}

	<div class='new-order' class:disabled={submitIsPending}>

		<div class='input-row' class:focused={amountIsFocused}>

			<div class='top'>

				<div class='selector product-wrap' on:click={() => {showModal('Products')}} data-intercept="true">
					<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}>
					<span>{shortSymbol($selectedProduct.symbol || $products[$selectedProductId])}</span>
					{@html CARET_DOWN}
				</div>

				<div class='selector select-leverage' on:click={() => {showModal('Leverage')}} data-intercept="true">
					<span>{$leverage}×</span>{@html CARET_DOWN}
				</div>

				<input id='amount' type='number' step="0.0001" on:focus={() => {amountIsFocused = true}}  on:blur={() => {amountIsFocused = false}} bind:value={$amount} min="0" max="1000000" maxlength="10" spellcheck="false" placeholder={`0.0`} autocomplete="off" autocorrect="off" inputmode="decimal" disabled={submitIsPending} lang="en">

			</div>

			{#if $selectedAddress}
			<div class='bottom'>

				<div class='left'>
					<Helper title='Reference Price' text="Execution price differs based on market conditions." moveRight={true} label={$prices[$selectedProductId] ? ($prices[$selectedProductId]).toFixed(2) : null} />
					<span class='chart-toggle' class:active={show_chart} on:click={() => {toggleChart()}}>Chart</span>
				</div>

				<div class='right'>
					
					{#if $margin > 0}
						
						<Helper title='Margin' moveLeft={true} text='Balance used for this trade.' label={`${formatToDisplay($margin, 4)} ${BASE_SYMBOL}`} />
						<Helper title='Trade Size (USD)' moveLeft={true} text='Margin × leverage.' small={true} label={`$${formatToDisplay($prices[1] * $amount, 2)}`} />

					{:else}

						<Helper title='Buying Power' moveLeft={true} text='Wallet balance × leverage.' label={`${formatToDisplay($buyingPower)} ${BASE_SYMBOL}`}/>
	
					{/if}
				
				</div>

			</div>
			{/if}

		</div>

		{#if show_chart}
		<Chart/>
		{/if}

		<div class='buttons'>
			{#if $isUnsupported}
				<button class='disabled'>Switch to Arbitrum to trade</button>
			{:else if !$selectedAddress}
				<button class='disabled'>Connect to Arbitrum to trade</button>
			{:else}
				<button class:disabled={submitIsPending || !$selectedAddress} class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button  class:disabled={submitIsPending || !$selectedAddress} class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
			{/if}
		</div>

	</div>

</div>
