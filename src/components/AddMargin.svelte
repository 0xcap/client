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
			data.isLong,
			data.id,
			margin,
			1,
			false,
			false
		);
		console.log('submitted add margin');
	}

	onMount(() => {
		console.log('modal data', data);
	})

</script>

<style>
</style>

<div class='container'>
	Add margin modal here. <a on:click={hideModal}>Close</a>
	<div>
		Margin: <input type=number bind:value={margin} min=0 max=10000000> 
	</div>
	<div>
		<a on:click={_submitOrder}>Submit</a>
	</div>
</div>