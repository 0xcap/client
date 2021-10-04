<script>

	import Helper from './Helper.svelte'

	import { showModal } from '../stores/modals'
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'

	import { BASE_SYMBOL } from '../lib/constants'
	import { LOGOS } from '../lib/logos'
	import { PLUS_ICON } from '../lib/icons'
	import { getProduct, cancelPosition, cancelOrder } from '../lib/methods'
	import { formatToDisplay, intify, formatPnl, shortSymbol } from '../lib/utils'

	let upls = {};
	let upls_percent = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	async function _cancelPosition(positionId) {
		const error = await cancelPosition(positionId);
	}

	async function _cancelOrder(orderId) {
		const error = await cancelOrder(orderId);
	}

	async function calculateUPLs(_prices) {
		totalUPL = 0;
		for (const position of $positions) {
			const upl = await getUPL(position);
			upls[position.positionId] = upl;
			if (!upl) continue;
			upls_percent[position.positionId] = (100 * upl * 1 / position.margin);
			totalUPL += upl * 1;
		}
		totalUPL = totalUPL.toFixed(4);
	}

	async function getUPL(position) {
		let latestPrice = $prices[position.productId];
		let upl = 0;
		if (position.price * 1 == 0) return undefined;
		if (latestPrice) {
			const productInfo = await getProduct(position.productId);
			if (position.isLong) {
				latestPrice = latestPrice * (1 - productInfo.fee/100);
				upl = position.margin * position.leverage * (latestPrice * 1 - position.price * 1) / position.price;
			} else {
				latestPrice = latestPrice * (1 + productInfo.fee/100);
				upl = position.margin * position.leverage * (position.price * 1 - latestPrice * 1) / position.price;
			}
			// Add interest
			let interest;
			let now = parseInt(Date.now() / 1000);
			if (position.isSettling || now < position.timestamp * 1 + 1800) {
				interest = 0;
			} else {
				interest = position.margin * position.leverage * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
			}
			if (interest < 0) interest = 0;
			upl -= interest;
		}
		return upl;
	}

	$: calculateUPLs($prices);

</script>

<style>

	.positions {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 0;
		padding: var(--base-padding);
		border-top: 1px solid var(--gray);
	}

	.empty {
		color: var(--gray-light);
		text-align: center;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--base-padding);
	}

	.header .title {
		font-weight: 700;
	}

	.positions-list {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 0;
		overflow: hidden;
		border-top: 1px solid var(--eerie-black);
	}

	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--eerie-black);
		height: 63px;
		overflow: hidden;
	}
	.position:hover {
		background-color: var(--eerie-black);
	}

	.details {
		display: flex;
		align-items: center;
		cursor: pointer;
		flex: 1 1 auto;
		height: 100%;
	}

	.direction {
		width: 10px;
		height: 26px;
		margin-right: var(--base-padding);
	}

	.direction.long {
		background-color: var(--green);
	}

	.direction.short {
		background-color: var(--red);
	}

	.product {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.product img {
		width: 24px;
		height: 24px;
		border-radius: 24px;
		margin-right: 8px;
	}

	.entry {
		color: var(--gray-light);
		font-weight: 400 !important;
		margin-left: 6px;
	}

	.entry-text-mobile {
		display: none;
	}

	.upl-entry {
		display: none;
	}

	@media (max-width: 600px) {
		.entry {
			display: none;
		}
	}

	.tools {
		display: flex;
		align-items: center;
	}

	.upl-wrap {
		text-align: right;
	}

	.upl-percent {
		margin-top: 10px;
		font-size: 80%;
		display: none;
	}

	.pos {
		color: var(--green) !important;
	}
	.neg {
		color: var(--red) !important;
	}

	.add-margin, .close {
		padding: 16px;
		margin-left: 8px;
		fill: var(--gray-light);
	}

	@media (max-width: 600px) {
		.add-margin, .close {
			margin-right: 0;
		}
	}

	.add-margin:hover {
		fill: #fff;
		background-color: var(--blue);
	}

	.close:hover {
		fill: var(--red);
	}

	.disabled {
		pointer-events: none;
	}

	:global(.positions svg) {
		height: 18px;
		fill: inherit;
		margin-bottom: -3px;
	}

	:global(.positions .close svg) {
		transform: rotate(45deg);
	}

</style>

<div class='positions'>

	{#if count == 0}

	{:else}

		<div class='header'>
			<div class='title'>Positions</div>
			{#if count > 1}
				<div class={`total-upl ${totalUPL * 1 > 0 ? 'pos' : 'neg'}`}>{formatPnl(totalUPL)}</div>
			{/if}
		</div>

		<div class='positions-list'>

			{#each $positions as position}
				
				{#if position.margin * 1 > 0}

				<div class='position'>

					<div class='details' on:click={() => {showModal('PositionDetails', position)}} data-intercept="true">
						<div class={`direction ${position.isLong ? 'long' : 'short'}`}></div>
						<div class='product'>
							<img src={LOGOS[position.productId]} alt={`${position.product} logo`}>
							<span>{shortSymbol(position.product)}</span>
							{#if position.price > 0}
							<span class='entry'>{formatToDisplay(position.price)}</span>
							{/if}
						</div>
					</div>

					<div class='tools'>

						<div class={`upl-wrap ${upls[position.positionId] * 1 > 0 ? 'pos' : 'neg'}`}>
							<div class='upl'>
								{formatPnl(upls[position.positionId])}
							</div>
							<!--
							<div class='upl-percent'>
								{formatPnl(upls_percent[position.positionId], undefined, true)}%
							</div>
							-->
						</div>

						{#if position.price * 1 == 0 || position.closeOrderId > 0}
							{#if position.price * 1 == 0}
								<Helper direction='right' text='Order being picked up by oracle.' type='opening' /> {#if position.timestamp * 1000 < Date.now() - 5 * 60 * 1000} <a on:click|stopPropagation={() => {_cancelPosition(position.positionId)}}>Cancel</a>
								{/if}
							{/if}

							{#if position.closeOrderId > 0}
								<Helper direction='right' text='Close order being picked up by oracle.' type='closing' />
								<a on:click|stopPropagation={() => {_cancelOrder(position.closeOrderId)}}>Cancel Close Order</a>
							{/if}
						{:else}

							<a class='close' class:disabled={position.closeOrderId > 0} on:click={() => {showModal('ClosePosition', position)}} data-intercept="true">
								{@html PLUS_ICON}
							</a>
						
						{/if}

					</div>

				</div>

				{/if}

			{/each}

		</div>

	{/if}

	
</div>