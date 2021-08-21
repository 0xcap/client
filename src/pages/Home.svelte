<script>
	import { onMount } from 'svelte'
	import { initProvider } from '../lib/provider'
	import { initEventListeners } from '../lib/events'

	import Header from '../components/Header.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import History from '../components/History.svelte'
	import Transactions from '../components/Transactions.svelte'
	import Vault from '../components/Vault.svelte'

	import Products from '../components/Products.svelte'
	import AddMargin from '../components/AddMargin.svelte'
	import ClosePosition from '../components/ClosePosition.svelte'

	import Toasts from '../components/Toasts.svelte'

	import { provider, signer, address, chainId } from '../stores/provider'
	import { activeModal } from '../stores/modals'

	onMount(async () => {	
		initProvider();
	});

	$: initEventListeners($address, $chainId);

</script>

<style>
	.home {
		width: 100%;
		max-width: var(--container-width);
		padding: 0 var(--base-padding);
		margin: var(--base-padding) auto;
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
	}

	.selected {
		font-weight: bold;
	}
</style>

<div class='home'>
	<Toasts />
	{#if $provider}
		<Header />
		<NewOrder />
		{#if $activeModal && $activeModal.name == 'Products'}
			<Products />
		{/if}
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