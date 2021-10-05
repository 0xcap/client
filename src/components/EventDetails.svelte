<script>

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { BASE_SYMBOL } from '../lib/constants'
	import { EXTERNAL_ICON } from '../lib/icons'
	import { txLink, formatToDisplay, formatPnl } from '../lib/utils'

	export let data;
	export let isActive;

	let rows = [];

	$: !data ? '' : rows = [
			{
				label: 'Position ID',
				value: data.positionId
			},
			{
				label: 'Date',
				value: data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : null
			},
			{
				label: 'Product',
				value: data.product
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Close Short' : 'Close Long'
			},
			{
				label: 'Entry Price',
				value: formatToDisplay(data.entryPrice),
			},
			{
				label: 'Close Price',
				value: formatToDisplay(data.price),
			},
			{
				label: 'Trade Size',
				value: `${formatToDisplay(data.amount)}`,
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(data.margin)}`,
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(data.leverage)}×`
			},
			{
				label: 'Profit or Loss',
				value: `${formatPnl(data.pnl, data.pnlIsNegative)} (${formatPnl(100*data.pnl/data.margin, data.pnlIsNegative, true)}%)`
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

<Modal isActive={isActive} noHeader={true}>
	<DataList data={rows} />
</Modal>