<script>
	import { onMount } from 'svelte'
	import { submitOrder } from '../lib/methods'

	import Modal from './Modal.svelte'
	
	export let data;

	let amount;
	let entire = false;

	let prior_amount;

	function checkEntire(_entire) {
		if (_entire) {
			prior_amount = amount;
			console.log('prior_amount', prior_amount);
			amount = data.margin * data.leverage;
		} else {
			amount = prior_amount;
		}
	}

	$: checkEntire(entire);

	async function _submitOrder() {
		console.log('(amount*1)/(data.leverage*1)', (amount*1)/(data.leverage*1));
		await submitOrder(
			data.baseId,
			data.productId,
			!data.isLong,
			(amount*1)/(data.leverage*1),
			1,
			data.id,
			false,
			true
		);
		console.log('submitted close position');
	}

	onMount(() => {
		document.getElementById('amount').focus();
	});

</script>

<style>

	.body input {
		padding: var(--base-padding);
	}

	.options {

	}

	.options label {
		display: flex;
		padding: var(--base-padding);
		border-top: 1px solid var(--gray-dark);
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

<Modal title='Close Position'>
	<div class='body'>
		<input id='amount' type=number bind:value={amount} min=0 max=10000000 placeholder="Amount to close"> 
	</div>
	<div class='options'>
		<label class='option' for='entire'>
			<input id='entire' type='checkbox' bind:checked={entire}> Close entire position
		</label>
	</div>
	<div class='button'>
		<button on:click={_submitOrder}>Close Position</button>
	</div>
</Modal>