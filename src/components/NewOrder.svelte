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

	let detailsVisible = false;

	function showDetails() {
		detailsVisible = true;
	}

	function hideDetails() {
		if (!$amount) detailsVisible = false;
	}

</script>

<style>

	.container {
		background-color: #333;
		padding: 8px;
	}

	.new-order {
		display:  grid;
		grid-auto-flow: row;
		grid-gap: 24px;
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

	.bottom {
		text-align: center;
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

				<input type='number' class='amount' bind:value={$amount} min="0" max="1000000" spellcheck="false" placeholder={`0.0 ${$baseInfo.symbol}`} autocomplete="off" autocorrect="off" inputmode="decimal">

			</div>

		</div>

		<div class='button-container'>
			{#if $userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1}
				<button on:click={_approveUserBaseAllowance}>Approve</button>
			{:else}
				<button class='button button-short' on:click={() => {_submitOrder(false)}}>Short</button><button class='button button-long' on:click={() => {_submitOrder(true)}}>Long</button>
			{/if}
		</div>

		{#if $buyingPower && $productInfo.symbol}
		<div class='bottom'>
			<div class='buying-power'>{$buyingPower} {$baseInfo.symbol} available to trade</div>
		</div>
		{/if}

	</div>

</div>