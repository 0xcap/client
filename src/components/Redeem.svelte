<script>
	import { onMount } from 'svelte'
	import { stake, redeem, getStakingPeriod, getRedemptionPeriod } from '../lib/methods'
	
	import Modal from './Modal.svelte'

	let amountToRedeem;

	async function _redeem() {
		// todo: checks
		await redeem(null, amountToRedeem);
		console.log('submitted redeem');
	}

	let next_period_date;
	let redemption_in_hours;

	onMount(async () => {
		document.getElementById('amount').focus();

		// get next redemption time
		const now = Date.now() / 1000;
		const staking_period = await getStakingPeriod();
		
		const seconds_since_last_period = now % staking_period;
		const seconds_till_next_period = staking_period - seconds_since_last_period;
		next_period_date = new Date((now + seconds_till_next_period)*1000).toLocaleString();

		const redemption_period = await getRedemptionPeriod();
		redemption_in_hours = parseInt(redemption_period / 3600);
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

<Modal title='Redeem'>
	<div class='body'>
		<input id='amount' type=number bind:value={amountToRedeem} min=0 max=10000000 placeholder="Amount to redeem"> 
	</div>
	<div class='details'>
		You can redeem your stake, plus profits or losses, during the next redemption period ({redemption_in_hours} hours starting {next_period_date}).
	</div>
	<div class='button'>
		<button on:click={_redeem}>Redeem</button>
	</div>
</Modal>