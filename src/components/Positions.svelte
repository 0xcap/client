<script>
	import { positions } from '../stores/positions'
	import { prices } from '../stores/prices'
	import { showModal } from '../stores/modals'

	import { getProductInfo } from '../lib/methods'

/*
Todo
-- product info should be an object, pass through cache (fetch from contract when unavailable locally), interest % and feed is needed for each one to calculate UPL per position
-- position settlement script
-- live prices
-- calculate UPL per position and total UPL including interest
-- add margin
-- close partial & full
-- historical positions (from events)
-- vault info: cap, balance, etc.
-- unstake
-- pending tx check on page load to check if they're complete
-- error handling and toasts
-- products depend on chain because of chainlink
-- chain switching in ui
-- block explorer links, tx data in transactions array
- ui design
- error strings
- data dashboard, liquidations

*/

	let upls = {};
	let totalUPL = 0;

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
</style>

<div class='container'>
	Positions. Total UPL {totalUPL}
	<ul>
		{#each $positions as position}
			<li>{position.product} {position.base} {position.id} {position.margin}x{position.leverage} @{position.price} [{position.isSettling}] ({position.isLong}) || UPL: {upls[position.id] || 0} <a on:click={() => {showModal('AddMargin', position)}}>Add margin</a> | <a on:click={() => {showModal('ClosePosition', position)}}>Close</a></li>
		{/each}
	</ul>
</div>