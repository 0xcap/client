<script>
	import { onMount } from 'svelte'
	import { initProvider } from '../lib/provider'
	import { initWallet } from '../lib/wallet'
	import { initEventListeners } from '../lib/events'

	import Wallet from '../components/Wallet.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import History from '../components/History.svelte'
	import Transactions from '../components/Transactions.svelte'
	import Vault from '../components/Vault.svelte'

	import AddMargin from '../components/AddMargin.svelte'
	import ClosePosition from '../components/ClosePosition.svelte'

	import { provider, signer, address, chainId } from '../stores/provider'
	import { activeModal } from '../stores/modals'

	onMount(async () => {
		initProvider();
		initWallet();
	});

	$: initEventListeners($address, $chainId);

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
		{#if $activeModal && $activeModal.name == 'AddMargin'}
			<AddMargin data={$activeModal.data} />
		{/if}
		{#if $activeModal && $activeModal.name == 'ClosePosition'}
			<ClosePosition data={$activeModal.data} />
		{/if}
		<hr/>
		<History />
		<hr/>
		<Vault />
		{#if $address}
		<hr/>
		<Transactions />
		{/if}
	{/if}
</div>