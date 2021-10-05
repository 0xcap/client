<script>

	import { onMount } from 'svelte'

	import Modal from './Modal.svelte'
	import DataList from './DataList.svelte'

	import { BASE_SYMBOL, PRICE_DECIMALS } from '../lib/constants'
	import { getUPL, getInterest, calculateLiquidationPrice } from '../lib/helpers'
	import { cancelPosition, cancelOrder } from '../lib/methods'
	import { formatUnits, formatToDisplay, formatPnl } from '../lib/utils'

	import { prices } from '../stores/prices'

	export let data;

	let liquidationPrice;

	onMount(async () => {
		const lp = await calculateLiquidationPrice(data);
		liquidationPrice = lp && lp.toFixed(PRICE_DECIMALS);
	});

	async function _cancelPosition() {
		const error = await cancelPosition(data.positionId);
	}

	async function _cancelOrder() {
		const error = await cancelOrder(data.closeOrderId);
	}

	// <a on:click|stopPropagation={() => {_cancelOrder(position.closeOrderId)}}>Cancel</a>
	//<a on:click|stopPropagation={() => {_cancelPosition(position.positionId)}}>Cancel</a>

	let rows = [];

	async function setRows(_prices) {

		const upl = await getUPL(data, _prices[data.productId]);
		const interest = await getInterest(data);

		const liquidatingSoon = data.isLong ? _prices[data.productId] <= liquidationPrice : _prices[data.productId] >= liquidationPrice;

		rows = [
			{
				label: 'ID',
				value: data.positionId
			},
			{
				label: 'Date',
				value: new Date(data.timestamp * 1000).toLocaleString()
			},
			{
				label: 'Product',
				value: data.product
			},
			{
				label: 'Direction',
				value: data.isLong ? 'Long' : 'Short'
			},
			{
				label: 'Execution Price',
				value: data.price ? formatToDisplay(data.price) : 'Settling'
			},
			{
				label: 'Trade Size',
				value: `${formatToDisplay(data.amount, 0, true)}`,
			},
			{
				label: 'Margin',
				value: `${formatToDisplay(data.margin, 0, true)}`,
				addMargin: true,
				data: data
			},
			{
				label: 'Leverage',
				value: `${formatToDisplay(data.leverage)}×`
			},
			{
				label: 'Unrealized P/L',
				value: `${formatPnl(upl)} (${formatPnl(100*upl/data.margin, upl < 0, true)}%)`,
				hasError: liquidatingSoon
			},
			{
				label: 'Accrued Interest',
				value: interest ? formatToDisplay(interest) : '0'
			},
			{
				label: 'Liquidation Price',
				value: "~" + formatToDisplay(liquidationPrice),
				hasError: liquidatingSoon
			}
		];
	}

	$: setRows($prices);

</script>

<style>
	.status {
		padding: var(--base-padding);
		text-align: center;
		border-bottom: 2px solid rgb(55,55,55);
	}
	.status a {
		color: inherit;
		text-decoration: underline;
	}
</style>

<Modal noHeader={true}>
	{#if data.price * 1 == 0 || data.closeOrderId > 0}
		{#if data.price * 1 == 0}
			<div class='status'>
				Status: Settling. <a on:click={_cancelPosition}>Cancel</a>
			</div>
		{/if}

		{#if data.closeOrderId > 0}
			<div class='status'>
				Status: Closing. <a on:click={_cancelOrder}>Cancel</a>
			</div>
		{/if}

	{/if}
	<DataList data={rows} />
</Modal>