<script>

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { BASE_SYMBOL } from '../lib/constants'
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
			label: 'Close Price',
			value: formatToDisplay(data.price)
		},
		{
			label: 'Entry Price',
			value: formatToDisplay(data.entryPrice)
		},
		{
			label: 'Margin',
			value: `${formatToDisplay(data.margin)} ${BASE_SYMBOL}`
		},
		{
			label: 'Leverage',
			value: `${formatToDisplay(data.leverage)}x`
		},
		{
			label: 'Amount',
			value: `${formatToDisplay(data.amount)} ${BASE_SYMBOL}`
		},
		{
			label: 'Profit or Loss',
			value: `${formatPnl(data.pnl, data.pnlIsNegative)}`
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