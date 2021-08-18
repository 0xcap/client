<script>
	import { onMount } from 'svelte'
	import { initProvider } from '../lib/provider'
	import { initWallet } from '../lib/wallet'
	import { initEventListeners, fetchEvents } from '../lib/events'

	import Wallet from '../components/Wallet.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import Vault from '../components/Vault.svelte'

	import { provider, signer, address, chainId } from '../stores/provider'
	import { events } from '../stores/events'

	import { listBases, getLatestPrice, submitOrder, getUserPositions } from '../lib/methods'

	// examples
	async function log(provider, address) {
		//console.log('called log', provider, address);
		if (!provider) return;

		// Non signed in
		//console.log('bases', await listBases());

		//console.log('getLatestPrice', await getLatestPrice(1));

		if (!address) return;

		// Signed in	
		//console.log('signer', $signer);
		//console.log('address', address);
		//console.log('positions', await getUserPositions('USDC'));
		//console.log('upl', await getUPL('USDC'));
		//console.log('locked', await getUserLocked('USDC'));
		//console.log('block', await provider.getBlockNumber());

		//await fetchEvents();
		
		//await deposit('USDC', 200);
		//console.log('balance', await getUserBalance('USDC'));
		//console.log('getUserAllowance', await getUserAllowance('USDC'));
		//console.log('approveAllowance', await approveAllowance('USDC'));
		//await submitOrder('USDC', 'BTC/USD', true, 2000);
		//await mintUSDC($address, 1000);
		//await withdraw('USDC', 200);
		//await addProduct();

	}

	onMount(async () => {
		initProvider();
		initWallet();
	});

	$: log($provider, $address);

	$: initEventListeners($address, $chainId);

	//$: console.log('events', $events);

</script>

<style>
	.container {
		width: 100%;
		max-width: var(--container-width);
		padding: 0 var(--base-padding);
		margin: 0 auto;
	}
</style>

<div class='container'>
	<div>Home</div>
	{#if $provider}
		<Wallet />
		{#if $address}
		all contract calls can work
		{:else}
		read-only contract calls can work
		{/if}
		<hr/>
		<NewOrder />
		<hr/>
		<Positions />
		<hr/>
		<Vault />
	{/if}
</div>