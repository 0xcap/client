import { get } from 'svelte/store'
import { contract, getBaseA } from './contracts'
import { events } from '../stores/events'
import { provider, signer, chainId, address } from '../stores/provider'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const eventKey = function(ev) {
	return "" + ev.event + ev.transactionHash;
}

const formatEvent = function(ev) {

	if (ev.event == 'Deposit') {
		const { from, base, amount } = ev.args;
		const _base = getBaseA(base);
		return {
			type: 'deposit',
			base: _base.symbol,
			amount: formatUnits(amount, _base.decimals),
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
	tradingContract.on(tradingContract.filters.Deposit(address), handleEvent);
	// todo: other event listeners
}

export async function fetchEvents() {
	const tradingContract = contract();
	if (!tradingContract) return;
	queryAndLoadEvents(tradingContract, tradingContract.filters.Deposit(get(address)));
	// todo: other user events
	// possibly use graph protocol for more efficient queries later
}