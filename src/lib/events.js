import { get } from 'svelte/store'
import { contract } from './contracts'
import { PRICE_DECIMALS, LEVERAGE_DECIMALS } from './constants'
import { events } from '../stores/events'
import { provider, signer, chainId, address } from '../stores/provider'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const eventKey = function(ev) {
	return "" + ev.event + ev.transactionHash;
}

const formatEvent = function(ev) {

	if (ev.event == 'NewPosition') {
		const { id, user, baseId, productId, isLong, priceWithFee, margin, leverage } = ev.args;
		const base = getBase(baseId);
		const product = getBase(productId);
		return {
			type: 'NewPosition',
			base: base.symbol,
			product: product.symbol,
			isLong: isLong,
			priceWithFee: formatUnits(priceWithFee, PRICE_DECIMALS),
			margin: formatUnits(margin, base.decimals),
			leverage: formatUnits(leverage, LEVERAGE_DECIMALS),
			txHash: ev.transactionHash,
			block: ev.blockNumber
		};
	}

}

function handleEvent() {
	const event = arguments[arguments.length - 1];
	events.update((x) => {
		x[eventKey(event)] = formatEvent(event);
		return x;
	});
}

async function queryAndLoadEvents(contract, filter) {
	const _events = await contract.queryFilter(filter);
	for (const ev of _events) {
		const { amount, base, from } = ev.args;
		const _base = getBaseA(base);
		events.update((x) => {
			x[eventKey(ev)] = formatEvent(ev);
			return x;
		});
	}
}

export function initEventListeners(address, chainId) {
	const tradingContract = contract();
	if (!tradingContract) return;
	tradingContract.removeAllListeners();
	if (!address || !chainId) return;
	tradingContract.on(tradingContract.filters.NewPosition(null, address), handleEvent);
	// todo: other event listeners
}

export async function fetchEvents() {
	const tradingContract = contract();
	if (!tradingContract) return;
	queryAndLoadEvents(tradingContract, tradingContract.filters.NewPosition(null, get(address)));
	// todo: other user events
	// possibly use graph protocol for more efficient queries later
}