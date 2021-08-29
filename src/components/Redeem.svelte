<script>

	import { redeem } from '../lib/methods'
	import { selectedVault } from '../stores/vault'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'
	import ModalButton from './ModalButton.svelte'

	let amount;

	let canSubmit;
	$: canSubmit = amount*1 > 0;

	let submitIsPending = false;
	async function _redeem() {
		submitIsPending = true;
		const error = await redeem(null, amount);
		submitIsPending = false;
	}

	let next_period_date;
	let redemption_in_hours;

	function getNextRedemptionTime(staking_period, redemption_period) {
		const now = Date.now() / 1000;
		const seconds_since_last_period = now % staking_period;
		const seconds_till_next_period = staking_period - seconds_since_last_period;
		next_period_date = new Date((now + seconds_till_next_period)*1000).toLocaleString();
		redemption_in_hours = parseInt(redemption_period / 3600);
	}

	$: getNextRedemptionTime($selectedVault.stakingPeriod, $selectedVault.redemptionPeriod);

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
		You can redeem your stake, plus profits or losses, during the next redemption period ({redemption_in_hours} hours starting {next_period_date}).
	</div>
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} label='Redeem' action={_redeem} />
</Modal>