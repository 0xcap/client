<script>

	import { onMount } from 'svelte'
	import { chainId } from '../stores/provider'
	import { CHAIN_DATA } from '../lib/constants'

	import Modal from './Modal.svelte'

	export let data;

	const explorer = CHAIN_DATA[$chainId]['explorer'];

	function txLink(hash) {
		return `${explorer}/tx/${hash}`; 
	}

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

<Modal title='Event Details'>

	<div class='row'>
		<div class='label'>Position ID</div>
		<div class='value'>{data.id}</div>
	</div>

	<div class='row'>
		<div class='label'>Vault</div>
		<div class='value'>{data.base}</div>
	</div>

	<div class='row'>
		<div class='label'>Product</div>
		<div class='value'>{data.product}</div>
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
		<div class='label'>Profit or Loss</div>
		<div class='value'>{data.pnl * 1 > 0 ? '+' : ''}{data.pnl}</div>
	</div>

	<div class='row'>
		<div class='label'>Fee Rebate</div>
		<div class='value'>{data.feeRebate}</div>
	</div>

	<div class='row'>
		<div class='label'>Protocol Fee</div>
		<div class='value'>{data.protocolFee}</div>
	</div>

	<div class='row'>
		<div class='label'>Was Liquidated</div>
		<div class='value'>{data.wasLiquidated ? 'Yes' : 'No'}</div>
	</div>

	<div class='row'>
		<div class='label'>Block</div>
		<div class='value'>{data.block}</div>
	</div>

	<div class='row'>
		<div class='label'>Transaction</div>
		<div class='value'><a href={txLink(data.txHash)} target='_blank'>TX</a></div>
	</div>

</Modal>