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

</script>

<style>

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: 24px;
	}

	.container {
		background-color: #333;
		padding: 8px;
	}

	.input-container {
		border:  1px solid white;
		display:  grid;
		grid-auto-rows: auto;
		row-gap: 6px;
	}

	.flex {
		display: flex;
	}

	.product-select {
		margin-right: 12px;
	}

	input.amount {
		flex: 1 1 auto;
		text-align: right;
	}

	.button-container {
		border:  1px solid white;
		display: grid;
		grid-auto-flow: column;
		grid-gap: 8px;
	}

	.button-short {
	}
	.button-long {
	}

	.selected {
		font-weight: 800;
	}
</style>

<div class='container'>

	<div class='new-order'>

		<div class='input-container'>

			<div class='top flex'>

				<button class='product-select flex' on:click={() => {showModal('Products', {})}}>
					<span>
						{#if $productInfo.symbol}
							{$productInfo.symbol} {$leverage}x
						{/if}
					</span>
					<span>({formatPrice($prices[$productId]) || ''})</span>
				</button>

				<input type='number' class='amount' bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder="0.0" autocomplete="off" autocorrect="off" inputmode="decimal">

			</div>

			{#if $buyingPower}
			<div class='bottom flex'>
				<div class='buying-power'>BP ~ {$buyingPower}</div>
				<div class='margin'>M ~ {$margin}</div>
			</div>
			{/if}

		</div>

		<div class='button-container'>
			{#if $userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1}
				<button on:click={_approveUserBaseAllowance}>Approve</button>
			{:else}
				<button class='button button-short' on:click={() => {_submitOrder(false)}}>Short</button><button class='button button-long' on:click={() => {_submitOrder(true)}}>Long</button>
			{/if}
		</div>

	</div>
	
	{#if $productInfo.leverage}
	<div>
		Product Selected || {$productInfo.symbol} fee: {$productInfo.fee}%, leverage: {$productInfo.leverage}, interest: {$productInfo.interest}%
	</div>
	{/if}

</div>