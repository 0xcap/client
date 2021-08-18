<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { getBaseInfo, getUserBaseBalance, getProductInfo, getUserAllowance, approveUserAllowance, submitOrder } from '../lib/methods'

	let baseId = 1;
	let productId = 1;
	let isLong = true;
	let margin;
	let leverage = 1;

	let baseInfo = {};
	let productInfo = {
		loading: true
	};

	let baseBalance = 0;
	let baseAllowance = 0;

	async function _getBaseBalance(address) {
		if (!address) return;
		baseBalance = await getUserBaseBalance(baseId);
	}

	async function _getUserAllowance(address) {
		if (!address) return;
		baseAllowance = await getUserAllowance(baseId);
	}

	async function _approveUserAllowance() {
		await approveUserAllowance(baseId);
	}

	function selectBase(_baseId) {
		baseId = _baseId;
		baseInfo = getBaseInfo(baseId);
	}

	async function selectProduct(_productId) {
		productId = _productId;
		productInfo.loading = true;
		productInfo = await getProductInfo(productId);
		leverage = parseInt(productInfo.leverage);
	}

	function selectDirection(_isLong) {
		isLong = _isLong;
	}

	async function _submitOrder() {
		// todo: checks
		await submitOrder(
			baseId,
			productId,
			isLong,
			0,
			margin,
			leverage,
			false
		);
		console.log('submitted');
	}

	onMount(async () => {
		selectBase(baseId);
		selectProduct(productId);
	});

	$: _getBaseBalance($address);
	$: _getUserAllowance($address);

</script>

<style>
	.selected {
		font-weight: 800;
	}
	
</style>

<div class='container'>
	new order

	<div>
		Base Selected || symbol: {baseInfo.symbol}, address: {baseInfo.address}, decimals: {baseInfo.decimals}
	</div>

	<div>
		Wallet balance: {baseBalance}, Allowance: {baseAllowance}
	</div>
	
	{#if !productInfo.loading}
	<div>
		Product Selected || fee: {productInfo.fee}%, leverage: {productInfo.leverage}, interest: {productInfo.interest}%
	</div>
	{/if}

	<div>
		Direction: <a class:selected={isLong} on:click={() => {selectDirection(true)}}>Long</a> | <a class:selected={!isLong} on:click={() => {selectDirection(false)}}>Short</a>
	</div>

	<div>
		Margin: <input type=number bind:value={margin} min=0 max=10000000>
	</div>

	<div>
		Leverage: <input type=range bind:value={leverage} min=1 max={productInfo.leverage || 100}> {leverage}
	</div>

	<div>
		{#if baseAllowance * 1 == 0 || margin * 1 > baseAllowance * 1}
			<a on:click={_approveUserAllowance}>Approve</a>
		{:else}
			<a on:click={_submitOrder}>Submit</a>
		{/if}
	</div>

</div>