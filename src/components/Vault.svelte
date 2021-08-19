<script>
	import { stake, unstake } from '../lib/methods'
	import { userStaked, vaultCap, vaultBalance, vaultTotalStaked } from '../stores/vault'

	let amountToStake;
	let amountToUnstake;

	async function _stake() {
		// todo: checks
		await stake(null, amountToStake);
		console.log('submitted stake');
	}

	async function _unstake() {
		// todo: checks
		await unstake(null, amountToUnstake);
		console.log('submitted unstake');
	}

</script>

<style>

</style>

<div class='container'>
	vault

	<div>
		Staked: {$userStaked}, Vault Total Staked: {$vaultTotalStaked}, Vault Balance: {$vaultBalance}, Vault Cap: {$vaultCap}
	</div>

	<div>
		Amount to stake: <input type=number bind:value={amountToStake} min=0 max=10000000>
	</div>

	<div>
		<a on:click={_stake}>Stake</a>
	</div>

	<div>
		Amount to unstake: <input type=number bind:value={amountToUnstake} min=0 max=10000000>
	</div>

	<div>
		<a on:click={_unstake}>Unstake</a>
	</div>

</div>