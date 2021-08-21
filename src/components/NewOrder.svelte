<script>
	import { onMount } from 'svelte'

	import { baseInfo } from '../stores/bases'
	import { userBaseBalance, userBaseAllowance } from '../stores/wallet'
	import { productId, productInfo, margin, leverage, amount, buyingPower } from '../stores/order'

	import { prices } from '../stores/prices'

	import { setBaseId, setProductId, listProducts, approveUserBaseAllowance, submitOrder } from '../lib/methods'

	import { showModal } from '../stores/modals'

	import { formatPrice } from '../lib/utils'

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

</script>

<style>

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: 12px;
		border-radius: 5px;
		font-size: 16.5px;
		margin: 24px 0;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border: 1px solid rgb(55,55,55);
		border-radius: 5px;
		padding: 16px;
	}

	.row:hover:not(.focused) {
		border-color: rgb(80,80,80);
	}
	.row.focused {
		border-color: rgb(80,80,80);
	}

	.row .label {
		font-weight: 700;
	}

	.row .sub-label {
		color: rgb(144,144,144);
		font-size: 80%;
		margin-top: 5px;
	}

	.row.product {
		cursor: pointer;
	}

	.row.buttons {
		border: none;
		padding: 0;
	}

	.product-select {
		display: flex;
		align-items: center;
		font-size: 20px;
	}

	.product-select span {
		margin-right: 8px;
	}

	input.amount {
		flex: 1 1 auto;
		text-align: right;
		font-size: 20px;
		font-weight: 500;
		color: #fff;
		outline: none;
		border: none;
		background-color: transparent;
		appearance: textfield;
	}

	button.button {
		text-align: center;
		outline: none;
		cursor: pointer;
		user-select: none;
		font-size: 15.5px;
		font-weight: 500;
		appearance: none;
		padding: 16px;
		border-radius: 5px;
		width: 100%;
		border: none;
		color: #222;
		font-weight: 700;
	}

	.button-short {
		background-color: rgb(255,80,0);
		margin-right: 8px;
	}
	.button-short:hover {
		background-color: rgb(235,80,0);
	}
	.button-long {
		background-color: rgb(0,200,5);
		margin-left: 8px;
	}
	.button-long:hover {
		background-color: rgb(0,180,5);
	}

</style>

<div class='new-order'>

	<div class='row product' on:click={() => {showModal('Products', {})}}>
		<div class='label-wrap'>
			<div class='label'>Product</div>
			<div class='sub-label'>Current price: {formatPrice($prices[$productId]) || ''}</div>
		</div>
		<div class='value'>
			<div class='product-select'>
				<span>
					{#if $productInfo.symbol}
						{$productInfo.symbol} {$leverage}x
					{/if}
				</span>
				<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" class="chevron">
					<path d="M0.97168 1L6.20532 6L11.439 1" stroke="#AEAEAE"></path>
				</svg>
			</div>
		</div>
	</div>

	<label class='row' class:focused={amountFocused} for='amount'>
		<div class='label-wrap'>
			<div class='label'>Amount</div>
			<div class='sub-label'>{$buyingPower} {$baseInfo.symbol} available to trade</div>
		</div>
		<div class='value'>
			<input id='amount' type='number' class='amount' on:focus={() => {amountFocused = true}}  on:blur={() => {amountFocused = false}} bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder='0.0' autocomplete="off" autocorrect="off" inputmode="decimal">
		</div>
	</label>

	<div class='row buttons'>
		{#if $userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1}
			<button on:click={_approveUserBaseAllowance}>Approve</button>
		{:else}
			<button class='button button-short' on:click={() => {_submitOrder(false)}}>Short</button><button class='button button-long' on:click={() => {_submitOrder(true)}}>Long</button>
		{/if}
	</div>

</div>