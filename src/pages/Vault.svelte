<script>

	import { activeModal } from '../stores/modals'

	import VaultInfo from '../components/VaultInfo.svelte'

	import Stake from '../components/Stake.svelte'
	import Redeem from '../components/Redeem.svelte'

</script>

<style>
</style>

<div class='vault'>
	{#if $activeModal && $activeModal.name == 'Stake'}
		<Stake />
	{/if}
	{#if $activeModal && $activeModal.name == 'Redeem'}
		<Redeem  data={$activeModal.data} />
	{/if}
	<VaultInfo />
</div>
		