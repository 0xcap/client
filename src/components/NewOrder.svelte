<script>
	import { onMount } from 'svelte'

	import { baseInfo } from '../stores/bases'
	import { userBaseBalance, userBaseAllowance } from '../stores/wallet'
	import { productId, productInfo, margin, leverage, amount, buyingPower } from '../stores/order'

	import { setBaseId, setProductId, listProducts, approveUserBaseAllowance, submitOrder } from '../lib/methods'

	import { showModal } from '../stores/modals'

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
	.selected {
		font-weight: 800;
	}
</style>

<div class='container'>

	<div class='new-order'>

		<div class='input-container'>

			<div class='product-select-wrap'>
				<a class='product-select' on:click={() => {showModal('Products', {})}}>
					{#if $productInfo.symbol}
						{$productInfo.symbol} {$leverage}x
					{/if}
				</a>
				<div class='buying-power'>BP ~ {$buyingPower}</div>
			</div>

			<div class='amount-wrap'>
				<div class='amount'>
					<input type=number bind:value={$amount} min=0 max=10000000>
				</div>
				<div class='margin'>M ~ {$margin}</div>
			</div>

		</div>

		<div class='button-container'>
			{#if $userBaseAllowance * 1 == 0 || $margin * 1 > $userBaseAllowance * 1}
				<a on:click={_approveUserBaseAllowance}>Approve</a>
			{:else}
				<a class='button button-short' on:click={() => {_submitOrder(false)}}>Short</a> | <a class='button button-long' on:click={() => {_submitOrder(true)}}>Long</a>
			{/if}
		</div>

	</div>
	
	{#if $productInfo.leverage}
	<div>
		Product Selected || {$productInfo.symbol} fee: {$productInfo.fee}%, leverage: {$productInfo.leverage}, interest: {$productInfo.interest}%
	</div>
	{/if}

</div>