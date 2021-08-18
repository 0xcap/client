<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { getUserPositions } from '../lib/methods'

	let baseId = 1;
	let positions = [];

	async function _getUserPositions(address) {
		if (!address) return;
		positions = await getUserPositions(baseId);
		console.log('positions', positions);
	}

	$: _getUserPositions($address);

</script>

<style>
</style>

<div class='container'>
	Positions

</div>