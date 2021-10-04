<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { BASE_SYMBOL, PRICE_DECIMALS } from '../lib/constants'
	import { calculateLiquidationPrice } from '../lib/helpers'
	import { cancelPosition, cancelOrder } from '../lib/methods'
	import { formatUnits, formatToDisplay } from '../lib/utils'

	import { prices } from '../stores/prices'

	export let data;

	let liquidationPrice;

	onMount(async () => {
		const lp = await calculateLiquidationPrice(data);
		liquidationPrice = lp && lp.toFixed(PRICE_DECIMALS);
	});

	async function _cancelPosition(positionId) {
		const error = await cancelPosition(positionId);
	}

	async function _cancelOrder(orderId) {
		const error = await cancelOrder(orderId);
	}

	// <a on:click|stopPropagation={() => {_cancelOrder(position.closeOrderId)}}>Cancel</a>
	//<a on:click|stopPropagation={() => {_cancelPosition(position.positionId)}}>Cancel</a>

	let rows;
	$: rows = [
		{
			label: 'ID',
			value: data.positionId
		},
		{
			label: 'Submitted',
			value: new Date(data.timestamp * 1000).toLocaleString()
		},
		{
			label: 'Direction',
			value: data.isLong ? 'Long' : 'Short'
		},
		{
			label: 'Entry Price',
			value: data.price ? formatToDisplay(data.price) : 'Settling',
			helper: 'Price includes fees.'
		},
		{
			label: 'Current Price',
			value: formatToDisplay($prices[data.productId])
		},
		{
			label: 'Trade Size',
			value: `${formatToDisplay(data.amount)} ${BASE_SYMBOL}`,
			helper: 'Equals margin times leverage.'
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
			label: 'Liquidation Price',
			value: "~" + formatToDisplay(liquidationPrice)
		}
	];



</script>

<style>

</style>

<Modal title={`${data.product} Position`}>
	<DataList data={rows} />
</Modal>