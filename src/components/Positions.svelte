<script>
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'
	import { showModal } from '../stores/modals'

	import { getProductInfo } from '../lib/methods'
	import { LOGOS } from '../lib/constants'

	import { PLUS_ICON } from '../lib/icons'
	import { formatPrice } from '../lib/utils'

	let upls = {};
	let totalUPL = 0;
	let count = 0;
	$: count = $positions && $positions.length || 0;

	async function calculateUPLs(_prices) {
		totalUPL = 0;
		for (const position of $positions) {
			const upl = await getUPL(position);
			upls[position.id] = upl * 1;
			totalUPL += upl * 1;
		}
		totalUPL = totalUPL.toFixed(4);
	}

	async function getUPL(position) {
		const latestPrice = $prices[position.productId];
		let upl = 0;
		if (latestPrice) {
			if (position.isLong) {
				upl = position.margin * position.leverage * (latestPrice * 1 - position.price * 1) / position.price;
			} else {
				upl = position.margin * position.leverage * (position.price * 1 - latestPrice * 1) / position.price;
			}
			// Add interest
			let interest;
			let now = parseInt(Date.now() / 1000);
			if (now < position.timestamp * 1 - 1800) {
				interest = 0;
			} else {
				const productInfo = await getProductInfo(position.productId);
				interest = position.margin * position.leverage * ((productInfo.interest || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
			}
			upl -= interest;
		}
		return upl.toFixed(4);
	}

	$: calculateUPLs($prices);

</script>

<style>

	.positions {
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
		margin-bottom: 50px;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

		.title {
			font-weight: 700;
		}

	.position {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: var(--base-radius);
		background-color: var(--black-almost);
		overflow: hidden;
		height: 76px;
		font-size: 20px;
	}

	.pos {
		color: var(--green);
	}
	.neg {
		color: var(--red);
	}

		.left {
			display: flex;
			align-items: center;
			cursor: pointer;
		}

			.direction {
				width: 10px;
				height: 76px;
				margin-right: var(--base-padding);
			}
				.direction.long {
					background-color: var(--green);
				}
				.direction.short {
					background-color: var(--red);
				}

			.info {

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
					margin-top: 12px;
					font-size: 80%;
				}

				.settling {
					margin-left: 6px;
					color: var(--orange);
				}


		.right {
			display: flex;
			align-items: center;
		}

			.upl {
				margin-right: var(--base-padding);
			}

			.add-margin, .close {
				border-left: 1px solid var(--gray-dark);
				padding: var(--base-padding);
			}

			:global(.positions .add-margin svg) {
				height: 16px;
				fill: var(--gray);
			}

			:global(.positions .close svg) {
				height: 16px;
				fill: var(--gray);
				transform: rotate(45deg);
			}

	.empty {
		color: var(--gray-light);
		text-align: center;
	}

</style>

<div class='positions'>

	{#if count == 0}
		<div class='empty'>Your positions will appear here.</div>

	{:else}

		<div class='header'>
			<div class='title'>Positions {#if count > 0}({count}){/if}</div>
			{#if count > 1}
				<div class={`total-upl ${totalUPL * 1 > 0 ? 'pos' : 'neg'}`}>{totalUPL * 1 > 0 ? '+' : ''}{totalUPL}</div>
			{/if}
		</div>

		{#each $positions as position}
			<div class='position'>
				<div class='left' on:click={() => {showModal('PositionDetails', position)}}>
					<div class={`direction ${position.isLong ? 'long' : 'short'}`}></div>
					<div class='info'>
						<div class='product'>
							<img src={LOGOS[position.productId]} alt={`${position.product} logo`}>
							<span>{position.product}</span>
							<span class='leverage'>{position.leverage}x</span>
						</div>
						<div class='entry'>
							{position.amount} {position.base} at {formatPrice(position.price, position.productId)}{#if position.isSettling}<span title='Price is settling' class='settling'>&#8226;</span>{/if}
						</div>
					</div>
				</div>
				<div class='right'>
					<div class={`upl ${upls[position.id] * 1 > 0 ? 'pos' : 'neg'}`}>
						{upls[position.id] * 1 > 0 ? '+' : ''}{upls[position.id] || 0}
					</div>
					<a class='add-margin' on:click={() => {showModal('AddMargin', position)}}>
						{@html PLUS_ICON}
					</a>
					<a class='close' on:click={() => {showModal('ClosePosition', position)}}>
						{@html PLUS_ICON}
					</a>
				</div>
			</div>
		{/each}

	{/if}

	
</div>