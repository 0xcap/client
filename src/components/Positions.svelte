<script>

	import { showModal } from '../stores/modals'
	import { positions, refreshUserPositions } from '../stores/positions'
	import { prices } from '../stores/prices'

	import { LOGOS } from '../lib/logos'
	import { getUPL } from '../lib/helpers'
	import { CANCEL_ICON } from '../lib/icons'
	import { formatToDisplay, formatPnl, shortSymbol } from '../lib/utils'

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

	let r;
	function monitorPositions(_count) {
		clearInterval(r);
		if (!_count) return;
		r = setInterval(() => {
			refreshUserPositions.update(n => n + 1);
		}, 5000);
	}

	$: monitorPositions(count);

</script>

<style>

	.positions {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 0;
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
		background-color: var(--rich-black-fogra);
		cursor: pointer;
	}
	.position:hover {
		background-color: var(--eerie-black);
	}

	.details {
		display: flex;
		align-items: center;
		flex: 1 1 auto;
		height: 100%;
	}

	.direction {
		margin-left: var(--base-padding);
		margin-right: 10px;
		font-weight: 800;
		font-size: 115%;
	}

	.direction.long {
		color: var(--green);
	}

	.direction.short {
		color: var(--red);
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
		color: var(--sonic-silver);
		font-weight: 400 !important;
		margin-left: 10px;
	}
	@media (max-width: 600px) {
		.info {
			display: none;
		}
	}

	.price {
		margin-left: 10px;
		opacity: 0.35;
	}

	.tools {
		display: flex;
		align-items: center;
	}

	.upl-wrap {
		text-align: right;
	}

	.status {
		color: var(--dim-gray);
		padding-right: var(--base-padding);
		margin-left: 10px;
	}

	.close {
		padding: 16px;
		margin-left: 8px;
		fill: var(--dim-gray);
	}

	.close:hover {
		fill: var(--red);
	}

	:global(.positions svg) {
		height: 18px;
		fill: inherit;
		margin-bottom: -3px;
	}

</style>

{#if count > 0}
<div class='positions'>

	<div class='header'>
		<div class='title'>Positions</div>
		{#if count > 1}
			<div class={`total-upl ${totalUPL * 1 > 0 ? 'pos' : 'neg'}`}>{formatPnl(totalUPL*1 || undefined)}</div>
		{/if}
	</div>

	<div class='positions-list'>

		{#each $positions as position}
			
			{#if position.margin * 1 > 0}

			<div class='position' on:click={() => {showModal('PositionDetails', position)}} data-intercept="true">

				<div class='details'>
					<div class={`direction ${position.isLong ? 'long' : 'short'}`}>
						{position.isLong ? '↑' : '↓'}
					</div>
					<div class='product'>
						<img src={LOGOS[position.productId]} alt={`${position.product} logo`}>
						<span>{shortSymbol(position.product)}</span>
						{#if position.price > 0}
						<div class='info'>
							<span class='amount'>{formatToDisplay(position.amount, 0, true)}</span><span class='price'>{formatToDisplay(position.price)}</span>
						</div>
						{/if}
					</div>
				</div>

				<div class='tools'>

					<div class={`upl-wrap ${upls[position.positionId] * 1 > 0 ? 'pos' : 'neg'}`}>
						<div class='upl'>
							{formatPnl(upls[position.positionId])}
						</div>
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

						<a class='close' on:click|stopPropagation={() => {showModal('ClosePosition', position)}} data-intercept="true">
							{@html CANCEL_ICON}
						</a>
					
					{/if}

				</div>

			</div>

			{/if}

		{/each}

	</div>

</div>
{/if}