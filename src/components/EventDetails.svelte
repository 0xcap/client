<script>

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { EXTERNAL_ICON } from '../lib/icons'
	import { txLink, formatToDisplay } from '../lib/utils'

	export let data;

	let rows;
	$: rows = [
		{
			label: 'Position ID',
			value: data.id
		},
		{
			label: 'Vault',
			value: data.base
		},
		{
			label: 'Product',
			value: data.product
		},
		{
			label: 'Price',
			value: data.price
		},
		{
			label: 'Margin',
			value: data.margin
		},
		{
			label: 'Leverage',
			value: data.leverage
		},
		{
			label: 'Amount',
			value: formatToDisplay(data.amount)
		},
		{
			label: 'Profit or Loss',
			value: `${data.pnl * 1 > 0 ? '+' : ''}${data.pnl}`
		},
		{
			label: 'Fee Rebate',
			value: data.feeRebate
		},
		{
			label: 'Protocol Fee',
			value: data.protocolFee
		},
		{
			label: 'Was Liquidated',
			value: data.wasLiquidated ? 'Yes' : 'No'
		},
		{
			label: 'Block',
			value: data.block
		},
		{
			label: 'Transaction',
			value: `<a href='${txLink(data.txHash)}' target='_blank'>${EXTERNAL_ICON}</a>`,
			renderHTML: true
		},
	];

</script>

<style>
</style>

<Modal title='Event Details'>
	<DataList data={rows} />
</Modal>