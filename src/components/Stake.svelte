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
		const error = await stake(null, amount);
		submitIsPending = false;
	}

	let next_period_date;
	function getNextRedemptionTime(staking_period) {
		const now = Date.now() / 1000;
		const seconds_since_last_period = now % staking_period;
		const seconds_till_next_period = staking_period - seconds_since_last_period;
		next_period_date = new Date((now + seconds_till_next_period)*1000).toLocaleString();
	}

	$: getNextRedemptionTime($selectedVault.stakingPeriod);
	
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
		Your stake will be locked until the next redemption period ({next_period_date}).
	</div>
	<ModalButton isDisabled={!canSubmit} isPending={submitIsPending} label='Stake' action={_stake} />
</Modal>