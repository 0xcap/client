<script>
	import { onMount } from 'svelte'

	import { productId, baseInfo, productInfo, userBaseBalance, userBaseAllowance } from '../stores/order'

	import { prices } from '../stores/prices'

	import { setBaseId, setProductId, listProducts, approveUserBaseAllowance, submitOrder } from '../lib/methods'

	let isLong = true;
	let margin;
	let leverage = 1;
	$: leverage = $productInfo.leverage;

	function selectDirection(_isLong) {
		isLong = _isLong;
	}

	async function _approveUserBaseAllowance() {
		await approveUserBaseAllowance();
	}

	async function _submitOrder() {
		// todo: checks
		await submitOrder(
			null,
			null,
			isLong,
			0,
			margin,
			leverage,
			false
		);
		console.log('submitted');
	}

	let products = listProducts();

	onMount(async () => {
		setBaseId(1);
		setProductId(1);
	});

	$: console.log('prices', $prices);

</script>

<style>
	.selected {
		font-weight: 800;
	}
	
</style>

<div class='container'>
	new order

	<div>
		Base Selected || symbol: {$baseInfo.symbol}, address: {$baseInfo.address}, decimals: {$baseInfo.decimals}
	</div>

	<div>
		Wallet balance: {$userBaseBalance}, Allowance: {$userBaseAllowance}
	</div>

	<div>
		Products:
		{#each products as product}
			<a class:selected={product.id == $productId} on:click={() => {setProductId(product.id)}}>{product.symbol}</a> |
		{/each}
	</div>
	
	{#if $productInfo.leverage}
	<div>
		Product Selected || {$productInfo.symbol} fee: {$productInfo.fee}%, leverage: {$productInfo.leverage}, interest: {$productInfo.interest}%
	</div>
	{/if}

	<div>
		Direction: <a class:selected={isLong} on:click={() => {selectDirection(true)}}>Long</a> | <a class:selected={!isLong} on:click={() => {selectDirection(false)}}>Short</a>
	</div>

	<div>
		Margin: <input type=number bind:value={margin} min=0 max=10000000>
	</div>

	<div>
		Leverage: <input type=range bind:value={leverage} min=1 max={$productInfo.leverage * 1 || 100}> {leverage}
	</div>

	<div>
		{#if $userBaseAllowance * 1 == 0 || margin * 1 > $userBaseAllowance * 1}
			<a on:click={_approveUserBaseAllowance}>Approve</a>
		{:else}
			<a on:click={_submitOrder}>Submit</a>
		{/if}
	</div>

</div>