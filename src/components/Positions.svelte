<script>

	import Helper from './Helper.svelte'

	import { showModal } from '../stores/modals'
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'

	import { BASE_SYMBOL } from '../lib/constants'
	import { LOGOS } from '../lib/logos'
	import { getUPL } from '../lib/helpers'
	import { CANCEL_ICON } from '../lib/icons'
	import { formatToDisplay, intify, formatPnl, shortSymbol } from '../lib/utils'

	let upls = {};
	let upls_percent = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	

	async function calculateUPLs(_prices) {
		totalUPL = 0;
		for (const position of $positions) {
			const upl = await getUPL(position, _prices[position.productId]);
			upls[position.positionId] = upl;
			if (!upl) continue;
			upls_percent[position.positionId] = (100 * upl * 1 / position.margin);
			totalUPL += upl * 1;
		}
		totalUPL = totalUPL.toFixed(4);
	}

	$: calculateUPLs($prices);

</script>

<style>

	.positions {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 0;
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
		font-size: 115%;
	}

	.header .title {
		font-weight: 700;
	}

	.positions-list {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 12px;
	}

	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 64px;
		font-size: 115%;
		border-radius: var(--base-radius);
		background-color: #0D0D0D;
	}
	.position:hover {
		background-color: #121212;
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
		height: 28px;
		margin-right: 10px;
		margin-left: var(--base-padding);
		border-radius: var(--base-radius);
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
		width: 26px;
		height: 26px;
		border-radius: 50%;
		margin-right: 8px;
	}

	.info {
		color: var(--gray-light);
		font-weight: 400 !important;
		margin-left: 10px;
	}
	.entry {
		
	}
	.sep {
		opacity: 0.15;
	}
	.price {
		opacity: 0.25;
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

	.status {
		color: var(--onyx2);
		padding-right: var(--base-padding);
		margin-left: 10px;
	}

	.add-margin, .close {
		padding: 16px;
		margin-left: 8px;
		fill: #303030;
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
							<div class='info'>
								<span class='amount'>{formatToDisplay(position.amount)} {BASE_SYMBOL}</span> <span class='sep'>|</span> <span class='price'>{formatToDisplay(position.price)}</span>
							</div>
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
								<div class='status'>
									Settling
								</div>
							{/if}

							{#if position.closeOrderId > 0}
								<div class='status'>
									Closing
								</div>
							{/if}

						{:else}

							<a class='close' class:disabled={position.closeOrderId > 0} on:click={() => {showModal('ClosePosition', position)}} data-intercept="true">
								{@html CANCEL_ICON}
							</a>
						
						{/if}

					</div>

				</div>

				{/if}

			{/each}

		</div>

	{/if}

	
</div>