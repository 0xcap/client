<script>
	import { onMount } from 'svelte'
	import { stake, getStakingPeriod, getRedemptionPeriod } from '../lib/methods'
	
	import Modal from './Modal.svelte'

	let amountToStake;

	async function _stake() {
		// todo: checks
		await stake(null, amountToStake);
		console.log('submitted stake');
	}

	let next_period_date;

	onMount(async () => {
		document.getElementById('amount').focus();

		// get next redemption time
		const now = Date.now() / 1000;
		const staking_period = await getStakingPeriod();
		const seconds_since_last_period = now % staking_period;
		const seconds_till_next_period = staking_period - seconds_since_last_period;
		next_period_date = new Date((now + seconds_till_next_period)*1000).toLocaleString();
	});

</script>

<style>
	.body{}

	input {
		padding: var(--base-padding);
	}

	.details {
		display: flex;
		padding: var(--base-padding);
		border-top: 1px solid var(--gray-dark);
		color: var(--gray-light);
		line-height: 1.45;
	}

	.button {
		border-top: 1px solid var(--gray-dark);
		padding: var(--base-padding);
	}

	.button button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 10px;
		border-radius: var(--base-radius);
		font-weight: 700;
		cursor: pointer;
	}
</style>

<Modal title='Stake'>
	<div class='body'>
		<input id='amount' type=number bind:value={amountToStake} min=0 max=10000000 placeholder="Amount to stake"> 
	</div>
	<div class='details'>
		Your stake will be locked until the next redemption period ({next_period_date}).
	</div>
	<div class='button'>
		<button on:click={_stake}>Stake</button>
	</div>
</Modal>