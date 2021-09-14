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
				label: 'Closed',
				value: data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : 'Recently'
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Short' : 'Long'
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

<Modal isActive={isActive} title={`${data && data.product} Trade`}>
	<DataList data={rows} />
</Modal>