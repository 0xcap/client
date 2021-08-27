<script>
	import { onMount } from 'svelte'

	import { LOGOS } from '../lib/constants'
	import { selectedBase } from '../stores/bases'
	import { margin, leverage, amount, buyingPower } from '../stores/order'
	import { selectedProductId, selectedProduct } from '../stores/products'
	import { prices } from '../stores/prices'
	import { selectedAddress, userBaseBalance, userBaseAllowance } from '../stores/wallet'

	import { approveAllowance, submitOrder } from '../lib/methods'

	import { showModal } from '../stores/modals'

	import { formatToDisplay } from '../lib/utils'

	import { CHAINLINK_ICON } from '../lib/icons'

	import { activateProductPrices } from '../lib/helpers'

	async function _approveUserBaseAllowance() {
		const error = await approveAllowance();
		if (error) {
			showToast(error);
		} else {
			// disable / pending state for approve button
		}
	}

	async function _submitOrder(isLong) {
		// todo: checks
		const error = await submitOrder(
			null,
			null,
			isLong,
			$margin * 1,
			$leverage * 1,
			0,
			false
		);
		if (error) {
			showToast(error);
		} else {
			// disable / pending state for form
		}
	}

	let amountFocused = false;

	function checkFocus(address) {
		const elem = document.getElementById('amount');
		if (elem && address) elem.focus();
	}

	onMount(() => {
		activateProductPrices($selectedProductId);
		checkFocus($selectedAddress);
	});

	$: checkFocus($selectedAddress);

</script>

<style>

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: 12px;
		background-color: var(--black-almost);
		padding: 12px;
		border-radius: 18px;
		box-shadow: rgba(0,200,5,0.1) 0px 12px 28px 0;
		/*box-shadow: rgba(255,80,0,0.15) 0px 12px 32px 0;*/
		
	}

		.row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 1px solid var(--gray-dark);
			border-radius: var(--base-radius);
			padding: var(--base-padding);
			background-color: var(--gray-darkest);
			cursor: pointer;
		}

		.row:hover, .row.focused {
			border-color: var(--gray);
		}

			.sub-label {
				color: var(--gray-light);
				font-size: 80%;
				margin-top: 5px;
				margin-right: 4px;
			}

			:global(.sub-label svg) {
				height: 12px;
				fill: var(--gray-light);
				margin-bottom: -2px;
			}

			.value-wrap {
				font-size: 20px;
				font-weight: 700;
			}

				.product-select {
					display: flex;
					align-items: center;
				}

				.product-select img {
					width: 24px;
					height: 24px;
					border-radius: 24px;
				}

				.product-select span {
					margin-left: 8px;
				}

				.product-select .leverage {
					font-weight: 400;
				}

			.input-wrap {
				flex: 1 1 auto;
			}

				input {
					text-align: right;
				}

		.buttons {
			font-weight: 700;
			display: grid;
			grid-auto-flow: column;
			grid-gap: 12px;
		}

			button {
				text-align: center;
				cursor: pointer;
				user-select: none;
				appearance: none;
				padding: var(--base-padding);
				border-radius: var(--base-radius);
				color: var(--gray-darkest);
				font-size: 20px;
			}

			.button-default {
				background-color: var(--blue);
				color: var(--gray-dark);
			}

			.button-disabled {
				background-color: var(--gray-dark);
				color: var(--gray-light);
				pointer-events: none;
				cursor: default;
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

	<div class='row' on:click={() => {showModal('Products')}}>
		<div class='label-wrap'>
			<div class='label'>Product</div>
			<div class='sub-label'>
				<span title='Price provided by Chainlink'>Price: {formatToDisplay($prices[$selectedProductId]) || ''}</span>
			</div>
		</div>
		<div class='value-wrap'>
			<div class='product-select'>
				{#if $selectedProduct.symbol}
					<img src={LOGOS[$selectedProductId]} alt={`${$selectedProduct.symbol} logo`}>
					<span>{$selectedProduct.symbol}</span>
					<span class='leverage'>{$leverage}x</span>
				{/if}
			</div>
		</div>
	</div>

	<label class='row' class:focused={amountFocused} for='amount'>
		<div class='label-wrap'>
			<div class='label'>Amount</div>
			<div class='sub-label'>Available: {formatToDisplay($buyingPower)} {$selectedBase && $selectedBase.symbol} <a on:click={() => {amount.set($buyingPower*1)}}>(Max)</a></div>
		</div>
		<div class='value-wrap input-wrap'>
			<input id='amount' type='number' on:focus={() => {amountFocused = true}}  on:blur={() => {amountFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder='0.0' autocomplete="off" autocorrect="off" inputmode="decimal">
		</div>
	</label>

	<div class='buttons'>
		{#if !$selectedAddress}
			<button class='button-disabled'>Connect a wallet</button>
		{:else if !$amount}
			<button class='button-disabled'>Enter an amount</button>
		{:else if $userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1}
			<button class='button-default' on:click={_approveUserBaseAllowance}>Approve {$selectedBase.symbol}</button>
		{:else}
			<button class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

</div>