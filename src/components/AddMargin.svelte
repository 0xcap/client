<script>
	import { onMount } from 'svelte'
	import { submitOrder } from '../lib/methods'
	
	import Modal from './Modal.svelte'

	export let data;

	let margin;

	async function _submitOrder() {
		await submitOrder(
			data.baseId,
			data.productId,
			data.isLong,
			margin,
			1,
			data.id,
			false,
			false
		);
		console.log('submitted add margin');
	}

	onMount(() => {
		document.getElementById('amount').focus();
	});

</script>

<style>
	.body{}

	input {
		padding: var(--base-padding);
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

<Modal title='Add Margin'>
	<div class='body'>
		<input id='amount' type=number bind:value={margin} min=0 max=10000000 placeholder="Margin to add"> 
	</div>
	<div class='button'>
		<button on:click={_submitOrder}>Add Margin</button>
	</div>
</Modal>