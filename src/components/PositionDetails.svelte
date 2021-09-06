<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { BASE_SYMBOL, PRICE_DECIMALS } from '../lib/constants'
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
			label: 'Submitted',
			value: new Date(data.timestamp * 1000).toLocaleString()
		},
		{
			label: 'Direction',
			value: data.isLong ? 'Long' : 'Short'
		},
		{
			label: 'Price',
			value: formatToDisplay(data.price),
			helper: 'Price includes fees.'
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
			label: 'Amount',
			value: `${formatToDisplay(data.amount)} ${BASE_SYMBOL}`,
			helper: 'Amount equals margin × leverage.'
		},
		{
			label: 'Has Settled',
			value: data.isSettling ? 'No' : 'Yes'
		},
		{
			label: 'Liquidation Price',
			value: formatToDisplay(liquidationPrice)
		}
	];

</script>

<style>

</style>

<Modal title={`${data.product} Position`}>
	<DataList data={rows} />
</Modal>