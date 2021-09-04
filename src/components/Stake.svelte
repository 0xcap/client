<script>

	import { stake } from '../lib/methods'
	import { selectedVault } from '../stores/vault'
	
	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
	import ModalButton from './ModalButton.svelte'

	let amount;

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _stake() {
		submitIsPending = true;
		const error = await stake(amount);
		submitIsPending = false;
	}
	
	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount to Stake'
		},
	];

</script>

<style>
	.details {
		display: flex;
		padding: var(--base-padding);
		border-top: 1px solid var(--gray-dark);
		color: var(--gray-light);
		line-height: 1.45;
	}
</style>

<Modal title='Stake'>
	<DataList data={rows} bind:value={amount} />
	<div class='details'>
		Your stake will be locked for {parseInt($selectedVault.stakingPeriod / (3600 * 24))} days.
	</div>
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} label='Stake' action={_stake} />
</Modal>