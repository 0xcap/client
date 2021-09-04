<script>

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { EXTERNAL_ICON } from '../lib/icons'
	import { txLink, formatToDisplay, formatPnl } from '../lib/utils'

	export let data;

	let rows;
	$: rows = [
		{
			label: 'Position ID',
			value: data.positionId
		},
		{
			label: 'Product',
			value: data.product
		},
		{
			label: 'Price',
			value: formatToDisplay(data.price)
		},
		{
			label: 'Margin',
			value: formatToDisplay(data.margin)
		},
		{
			label: 'Leverage',
			value: formatToDisplay(data.leverage)
		},
		{
			label: 'Amount',
			value: formatToDisplay(data.amount)
		},
		{
			label: 'Profit or Loss',
			value: `${formatPnl(data.pnl, data.pnlIsNegative)}`
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

<Modal title='Trade'>
	<DataList data={rows} />
</Modal>