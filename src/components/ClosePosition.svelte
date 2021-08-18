<script>
	import { onMount } from 'svelte'
	import { hideModal } from '../stores/modals'
	import { submitOrder } from '../lib/methods'
	
	export let data;

	let margin;

	async function _submitOrder() {
		await submitOrder(
			data.baseId,
			data.productId,
			!data.isLong,
			data.id,
			margin,
			1,
			false,
			true
		);
		console.log('submitted close position');
	}

	onMount(() => {
		console.log('modal data', data);
	})

</script>

<style>
</style>

<div class='container'>
	Close position modal. <a on:click={hideModal}>Close</a>
	<div>
		Margin to close: <input type=number bind:value={margin} min=0 max=10000000> 
	</div>
	<div>
		<a on:click={_submitOrder}>Submit</a>
	</div>
</div>