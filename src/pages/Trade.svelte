<script>
	import { onMount } from 'svelte'
	import { initProvider } from '../lib/provider'
	import { initEventListeners } from '../lib/events'

	import Header from '../components/Header.svelte'
	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import History from '../components/History.svelte'
	import Account from '../components/Account.svelte'

	import Products from '../components/Products.svelte'
	import PositionDetails from '../components/PositionDetails.svelte'
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
	.trade {
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
	}
</style>

<div class='trade'>
	{#if $activeModal && $activeModal.name == 'Products'}
		<Products />
	{/if}
	{#if $address}
		{#if $activeModal && $activeModal.name == 'Account'}
			<Account />
		{/if}
	{/if}
	{#if $activeModal && $activeModal.name == 'PositionDetails'}
		<PositionDetails data={$activeModal.data} />
	{/if}
	{#if $activeModal && $activeModal.name == 'AddMargin'}
		<AddMargin data={$activeModal.data} />
	{/if}
	{#if $activeModal && $activeModal.name == 'ClosePosition'}
		<ClosePosition data={$activeModal.data} />
	{/if}
	<NewOrder />
	
	<hr/>
	<Positions />
	
	<hr/>
	<History />
</div>