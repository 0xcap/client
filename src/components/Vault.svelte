<script>
	import { stake } from '../lib/methods'
	import { userStaked } from '../stores/vault'

	let amount;

	async function _stake() {
		// todo: checks
		await stake(null, amount);
		console.log('submitted stake');
	}

</script>

<style>

</style>

<div class='container'>
	vault

	<div>
		Staked: {$userStaked}
	</div>

	<div>
		Amount: <input type=number bind:value={amount} min=0 max=10000000>
	</div>

	<div>
		<a on:click={_stake}>Stake</a>
	</div>

</div>