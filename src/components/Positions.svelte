<script>

	import { showModal } from '../stores/modals'
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'

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
			upls[position.id] = upl * 1;
			upls_percent[position.id] = (100 * upl * 1 / position.margin);
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

	.positions-list {
		border-radius: var(--base-radius);
		overflow: hidden;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 4px;
	}

	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--black-almost);
		overflow: hidden;
		height: 80px;
		font-size: 20px;
	}
	.position:hover {
		background-color: var(--gray-between);
	}

	.details {
		display: flex;
		align-items: center;
		cursor: pointer;
		flex: 1 1 auto;
	}

	.direction {
		width: 10px;
		height: 80px;
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
		width: 20px;
		height: 20px;
		border-radius: 20px;
	}

	.product span {
		margin-left: 8px;
	}

	.product .leverage {
		font-weight: 400;
	}

	.entry {
		color: var(--gray-light);
		margin-top: 10px;
		font-size: 80%;
	}

	.settling {
		margin-left: 6px;
		color: var(--orange);
	}

	.tools {
		display: flex;
		align-items: center;
	}

	.upl-wrap {
		margin-right: 24px;
		text-align: right;
	}

	.upl-percent {
		margin-top: 10px;
		font-size: 80%;
	}

	.pos {
		color: var(--green);
	}
	.neg {
		color: var(--red);
	}

	.add-margin, .close {
		padding: 16px;
		margin-right: 8px;
		fill: var(--gray);
	}

	.add-margin:hover {
		fill: var(--blue);
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
			<div class='title'>Positions {#if count > 0}({count}){/if}</div>
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
								<span class='leverage'>{intify(position.leverage)}x</span>
							</div>
							<div class='entry'>
								{formatToDisplay(position.amount)} {position.base} at {formatToDisplay(position.price)}{#if position.isSettling}<span title='Price is settling' class='settling'>&#8226;</span>{/if}
							</div>
						</div>
					</div>

					<div class='tools'>
						<div class={`upl-wrap ${upls[position.id] * 1 > 0 ? 'pos' : 'neg'}`}>
							<div class='upl'>
								{formatPnl(upls[position.id])}
							</div>
							<div class='upl-percent'>
								{formatPnl(upls_percent[position.id], true)}%
							</div>
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