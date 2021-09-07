<script>

	import Helper from './Helper.svelte'

	import { showModal } from '../stores/modals'
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'

	import { BASE_SYMBOL } from '../lib/constants'
	import { LOGOS } from '../lib/logos'
	import { PLUS_ICON } from '../lib/icons'
	import { getProduct } from '../lib/methods'
	import { formatToDisplay, intify, formatPnl } from '../lib/utils'

	let upls = {};
	let upls_percent = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	async function calculateUPLs(_prices) {
		totalUPL = 0;
		for (const position of $positions) {
			const upl = await getUPL(position);
			upls[position.positionId] = upl * 1;
			upls_percent[position.positionId] = (100 * upl * 1 / position.margin);
			totalUPL += upl * 1;
		}
		totalUPL = totalUPL.toFixed(4);
	}

	async function getUPL(position) {
		let latestPrice = $prices[position.productId];
		let upl = 0;
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
			if (now < position.timestamp * 1 - 1800) {
				interest = 0;
			} else {
				interest = position.margin * position.leverage * ((productInfo.interest || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
			}
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
		grid-gap: var(--base-padding);
	}

	.empty {
		color: var(--gray-light);
		text-align: center;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header .title {
		font-weight: 700;
	}

	.positions-list {
		border-radius: var(--base-radius);
		overflow: hidden;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 5px;
	}

	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: rgba(23,23,23,0.4);
		height: 86px;
		font-size: 115%;
	}
	.position:hover {
		background-color: rgba(23,23,23,0.55);
	}

	.details {
		display: flex;
		align-items: center;
		cursor: pointer;
		flex: 1 1 auto;
	}

	.direction {
		width: 10px;
		height: 86px;
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

	.product .leverage {
		margin-left: 4px;
		font-weight: 400;
	}

	@media (max-width: 600px) {
		.product .leverage {
			display: none;
		}
	}

	.entry {
		color: var(--gray-light);
		margin-top: 8px;
		font-size: 80%;
		display: flex;
		align-items: center;
	}

	.entry-text-mobile {
		display: none;
	}

	.upl-entry {
		display: none;
	}

	@media (max-width: 600px) {
		.entry-text {
			display: none;
		}
		.entry-text-mobile, .upl-entry {
			display: inline;
		}
	}

	.tools {
		display: flex;
		align-items: center;
	}

	.upl-wrap {
		margin-right: 20px;
		text-align: right;
	}

	@media (max-width: 600px) {
		.upl-wrap {
			display: none;
			margin-right: 0;
		}
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
		margin-right: 8px;
		fill: var(--gray);
	}

	@media (max-width: 600px) {
		.add-margin, .close {
			margin-right: 0;
		}
	}

	.add-margin:hover {
		fill: #fff;
	}

	.close:hover {
		fill: var(--red);
	}

	:global(.positions svg) {
		height: 16px;
		fill: inherit;
		margin-bottom: -2px;
	}

	:global(.positions .close svg) {
		transform: rotate(45deg);
	}

</style>

<div class='positions'>

	{#if count == 0}
		<div class='empty'>Your positions will appear here.</div>
	{:else}

		<div class='header'>
			<div class='title'>Positions</div>
			{#if count > 1}
				<div class={`total-upl ${totalUPL * 1 > 0 ? 'pos' : 'neg'}`}>{formatPnl(totalUPL)}</div>
			{/if}
		</div>

		<div class='positions-list'>

			{#each $positions as position}
				
				<div class='position'>

					<div class='details' on:click={() => {showModal('PositionDetails', position)}} data-intercept="true">
						<div class={`direction ${position.isLong ? 'long' : 'short'}`}></div>
						<div>
							<div class='product'>
								<img src={LOGOS[position.productId]} alt={`${position.product} logo`}>
								<span>{position.product}</span>
								<span class='leverage'>{formatToDisplay(position.leverage)}×</span>
							</div>
							<div class='entry'>
								<span class='entry-text'>
									{formatToDisplay(position.amount)} {BASE_SYMBOL} at {formatToDisplay(position.price)}
								</span><span class='entry-text-mobile'>
									{formatToDisplay(position.amount)}@{formatToDisplay(position.price)}
								</span>{#if position.isSettling}<Helper direction='right' text='Settles at the next oracle price change.' type='settling' />{/if}
								<span class={`upl-entry ${upls[position.positionId] * 1 > 0 ? 'pos' : 'neg'}`}>
									{formatPnl(upls[position.positionId])}
								</span>
							</div>
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
						<a class='add-margin' on:click={() => {showModal('AddMargin', position)}} data-intercept="true">
							{@html PLUS_ICON}
						</a>
						<a class='close' on:click={() => {showModal('ClosePosition', position)}} data-intercept="true">
							{@html PLUS_ICON}
						</a>
					</div>

				</div>

			{/each}

		</div>

	{/if}

	
</div>