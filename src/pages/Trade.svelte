<script>

	import NewOrder from '../components/NewOrder.svelte'
	import Positions from '../components/Positions.svelte'
	import History from '../components/History.svelte'

	import { isUnsupported } from '../stores/wallet'

</script>

<style>
	.trade {
		display: grid;
		grid-auto-flow: row;
		background-color: var(--less-black);
		border-radius: var(--base-radius);
	}
</style>



<div class='trade'>
	<NewOrder />
	{#if !$isUnsupported}
		<Positions />
		<History />
	{/if}
</div>