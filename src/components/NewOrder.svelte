<script>
	import { onMount } from 'svelte'

	import { signer, address } from '../stores/provider'

	import { LOGOS } from '../lib/constants'
	import { baseInfo } from '../stores/bases'
	import { userBaseBalance, userBaseAllowance } from '../stores/wallet'
	import { productId, productInfo, margin, leverage, amount, buyingPower } from '../stores/order'

	import { prices, activateProduct } from '../stores/prices'

	import { setBaseId, setProductId, listProducts, approveUserBaseAllowance, submitOrder } from '../lib/methods'

	import { showModal } from '../stores/modals'

	import { formatPrice, formatBaseAmount } from '../lib/utils'

	async function _approveUserBaseAllowance() {
		await approveUserBaseAllowance();
	}

	async function _submitOrder(isLong) {
		// todo: checks
		await submitOrder(
			null,
			null,
			isLong,
			0,
			$margin * 1,
			$leverage * 1,
			false
		);
	}

	let amountFocused = false;

	onMount(() => {
		activateProduct($productId);
	});

</script>

<style>

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
		margin: var(--base-padding) 0;
	}

		.row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 1px solid var(--gray-dark);
			border-radius: var(--base-radius);
			padding: var(--base-padding);
			cursor: pointer;
		}

		.row:hover, .row.focused {
			border-color: var(--gray);
		}

			.sub-label {
				color: var(--gray-light);
				font-size: 80%;
				margin-top: 5px;
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
			display: flex;
			font-weight: 700;
		}

			button {
				text-align: center;
				cursor: pointer;
				user-select: none;
				appearance: none;
				padding: var(--base-padding);
				border-radius: var(--base-radius);
				color: var(--gray-darkest);
			}

			.button-default {
				background-color: var(--blue);
				color: var(--gray-dark);
			}

			.button-short {
				background-color: var(--red);
				margin-right: 8px;
			}
			.button-short:hover {
				background-color: var(--red-dark);
			}
			.button-long {
				background-color: var(--green);
				margin-left: 8px;
			}
			.button-long:hover {
				background-color: var(--green-dark);
			}

</style>

<div class='new-order'>

	<div class='row' on:click={() => {showModal('Products')}}>
		<div class='label-wrap'>
			<div class='label'>Product</div>
			<div class='sub-label'>Current price: {formatPrice($prices[$productId]) || ''}</div>
		</div>
		<div class='value-wrap'>
			<div class='product-select'>
				{#if $productInfo.symbol}
					<img src={LOGOS[$productId]} alt={`${$productInfo.symbol} logo`}>
					<span>{$productInfo.symbol}</span>
					<span class='leverage'>{$leverage}x</span>
				{/if}
			</div>
		</div>
	</div>

	<label class='row' class:focused={amountFocused} for='amount'>
		<div class='label-wrap'>
			<div class='label'>Amount</div>
			<div class='sub-label'>{formatBaseAmount($buyingPower)} {$baseInfo && $baseInfo.symbol} available to trade <a on:click={() => {amount.set($buyingPower*1)}}>(Max)</a></div>
		</div>
		<div class='value-wrap input-wrap'>
			<input id='amount' type='number' on:focus={() => {amountFocused = true}}  on:blur={() => {amountFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder='0.0' autocomplete="off" autocorrect="off" inputmode="decimal">
		</div>
	</label>

	<div class='buttons'>
		{#if $address && ($userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1)}
			<button class='button-default' on:click={_approveUserBaseAllowance}>Approve {$baseInfo.symbol}</button>
		{:else}
			<button class='button-short' on:click={() => {_submitOrder(false)}}>Short</button><button class='button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

</div>