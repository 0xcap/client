<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'

	export let data;

</script>

<style>

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--gray-dark);
		padding: var(--base-padding);
	}

	.label {
		color: var(--gray-light);
	}

	.value {

	}

</style>

<Modal title='Position Details'>

	<div class='row'>
		<div class='label'>ID</div>
		<div class='value'>{data.id}</div>
	</div>

	<div class='row'>
		<div class='label'>Base</div>
		<div class='value'>{data.base}</div>
	</div>

	<div class='row'>
		<div class='label'>Product</div>
		<div class='value'>{data.product}</div>
	</div>

	<div class='row'>
		<div class='label'>Submitted</div>
		<div class='value'>{new Date(data.timestamp * 1000).toLocaleString()}</div>
	</div>

	<div class='row'>
		<div class='label'>Direction</div>
		<div class='value'>{data.isLong ? 'Long' : 'Short'}</div>
	</div>

	<div class='row'>
		<div class='label'>Price</div>
		<div class='value'>{data.price}</div>
	</div>

	<div class='row'>
		<div class='label'>Margin</div>
		<div class='value'>{data.margin}</div>
	</div>

	<div class='row'>
		<div class='label'>Leverage</div>
		<div class='value'>{data.leverage}</div>
	</div>

	<div class='row'>
		<div class='label'>Amount</div>
		<div class='value'>{data.amount}</div>
	</div>

	<div class='row'>
		<div class='label'>Has Settled</div>
		<div class='value'>{data.isSettling ? 'No' : 'Yes'}</div>
	</div>

	<div class='row'>
		<div class='label'>Liquidation Price</div>
		<div class='value'>{data.liquidationPrice}</div>
	</div>

</Modal>