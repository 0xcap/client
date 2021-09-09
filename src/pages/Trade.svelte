<script>

	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import History from '../components/History.svelte'

	// Modals
	import Products from '../components/Products.svelte'
	import PositionDetails from '../components/PositionDetails.svelte'
	import AddMargin from '../components/AddMargin.svelte'
	import ClosePosition from '../components/ClosePosition.svelte'
	import EventDetails from '../components/EventDetails.svelte'

	import { activeModal } from '../stores/modals'
	import { isUnsupported } from '../stores/wallet'

</script>

<style>
	.trade {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 80px;
	}
</style>

{#if $activeModal && $activeModal.name == 'Products'}
	<Products />
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
{#if $activeModal && $activeModal.name == 'EventDetails'}
	<EventDetails data={$activeModal.data} />
{/if}

<div class='trade'>
	<NewOrder />
	{#if !$isUnsupported}
		<Positions />
		<History />
	{/if}
</div>