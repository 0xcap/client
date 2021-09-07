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
			label: 'Entry Price',
			value: formatToDisplay(data.entryPrice),
			helper: 'Price includes fees.'
		},
		{
			label: 'Close Price',
			value: formatToDisplay(data.price),
			helper: 'Price includes fees.'
		},
		{
			label: 'Profit or Loss',
			value: `${formatPnl(data.pnl, data.pnlIsNegative)} ${BASE_SYMBOL}`,
			helper: 'P/L includes interest charged.'
		},
		{
			label: 'Amount',
			value: `${formatToDisplay(data.amount)} ${BASE_SYMBOL}`,
			helper: 'Amount equals margin × leverage.'
		},
		{
			label: 'Margin',
			value: `${formatToDisplay(data.margin)} ${BASE_SYMBOL}`,
			helper: 'Real balance used from your wallet.'
		},
		{
			label: 'Leverage',
			value: `${formatToDisplay(data.leverage)}×`
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