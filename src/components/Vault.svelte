<script>
	import { stake, getUserStaked } from '../lib/methods'
	import { signer, address } from '../stores/provider'

	let baseId = 1;
	let amount;

	let staked;

	async function _getUserStaked(address) {
		if (!address) return;
		staked = await getUserStaked(baseId);
	}

	async function _stake() {
		// todo: checks
		await stake(baseId, amount);
		console.log('submitted stake');
	}

	$: _getUserStaked($address);

</script>

<style>

</style>

<div class='container'>
	vault

	<div>
		Staked: {staked}
	</div>

	<div>
		Amount: <input type=number bind:value={amount} min=0 max=10000000>
	</div>

	<div>
		<a on:click={_stake}>Stake</a>
	</div>

</div>