<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { PRICE_DECIMALS } from '../lib/constants'
	import { calculateLiquidationPrice } from '../lib/helpers'
	import { getProduct } from '../lib/methods'
	import { formatUnits, formatToDisplay } from '../lib/utils'

	export let data;

	let liquidationPrice;

	onMount(async () => {
		const lp = await calculateLiquidationPrice(data);
		liquidationPrice = lp && lp.toFixed(PRICE_DECIMALS);
	});

	let rows;
	$: rows = [
		{
			label: 'ID',
			value: data.positionId
		},
		{
			label: 'Product',
			value: data.product
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
			label: 'Price',
			value: data.price
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
			label: 'Has Settled',
			value: data.isSettling ? 'No' : 'Yes'
		},
		{
			label: 'Liquidation Price',
			value: liquidationPrice
		}
	];

</script>

<style>

</style>

<Modal title='Position Details'>
	<DataList data={rows} />
</Modal>