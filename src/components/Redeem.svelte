<script>

	import { redeem } from '../lib/methods'
	import { selectedVault } from '../stores/vault'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
	import ModalButton from './ModalButton.svelte'

	export let data;

	let amount;

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _redeem() {
		submitIsPending = true;
		const error = await redeem(data.stakeId, amount);
		submitIsPending = false;
	}

	let next_redemption_time = new Date((data.timestamp * 1 + $selectedVault.stakingPeriod * 1)*1000).toLocaleString();
	let redemption_in_hours = parseInt($selectedVault.redemptionPeriod / 3600);

	let rows;
	$: rows = [
		{
			type: 'input',
			label: 'Amount to Redeem'
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

<Modal title='Redeem'>
	<DataList data={rows} bind:value={amount} />
	<div class='details'>
		You can redeem this stake, plus profits or losses, during {redemption_in_hours} hours starting {next_redemption_time}.
	</div>
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} label='Redeem' action={_redeem} />
</Modal>