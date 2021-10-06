import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { getContract } from './helpers'

import { refreshUserPositions, sessionPositionIds } from '../stores/positions'
import { refreshUserBaseBalance, userBaseAllowance, selectedAddress } from '../stores/wallet'
import { sessionTrades, history } from '../stores/history'
import { showToast } from '../stores/toasts'

import { completeTransaction } from '../stores/transactions'

import { formatEvent, formatTrades } from './utils'
	
// toasts dark for a period after page load
let acceptToasts = false;
setTimeout(() => {
	acceptToasts = true;
}, 4000);

let q;
function initQuickPositionsRefresh() {
	let i = 0;
	let q = setInterval(() => {
		console.log('initQuickPositionsRefresh', i);
		refreshUserPositions.update(n => n + 1);
		i++;
		if (i >= 40) clearInterval(q);
	}, 2000);
}

export async function handleTransactionEvent(ev) {
	handleEvent(ev);
}

async function handleEvent() {

	const ev = arguments[arguments.length - 1];

	console.log('got event', Date.now(), ev);

	//console.log('handling event', ev);

	if (ev.event == 'OpenOrder') {
		// From TX checker only
		completeTransaction(ev.transactionHash);
		const position_id = ethers.utils.defaultAbiCoder.decode([ 'uint256' ], ev.txReceipt.logs[0].topics[1])[0].toNumber();
		sessionPositionIds.update((arr) => {
			arr.push(position_id);
			return arr;
		});
		console.log('position_id', position_id);
		//initQuickPositionsRefresh();
		if (acceptToasts) showToast('Order submitted.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	} else if (ev.event == 'CancelPosition') {
		// From TX checker only
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
	} else if (ev.event == 'NewPosition') {
		// From listener only - oracle triggered
		refreshUserPositions.update(n => n + 1);
	} else if (ev.event == 'AddMargin') {
		// From TX checker only
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		if (acceptToasts) showToast('Margin added.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	} else if (ev.event == 'CloseOrder') {
		// From TX checker only
		completeTransaction(ev.transactionHash);
		console.log('Close order succeeded', ev);
		if (acceptToasts) showToast('Close order submitted.', 'success');
		refreshUserPositions.update(n => n + 1);
		//initQuickPositionsRefresh();
	} else if (ev.event == 'ClosePosition') {
		// From listener only - oracle triggered

		if (ev.args.isFullClose) {
			let position_id= ev.args.positionId.toNumber();
			sessionPositionIds.update((arr) => {
				arr = arr.filter((value) => {
					return value != position_id;
				});
				return arr;
			});
		} else {
			refreshUserPositions.update(n => n + 1);
		}

		refreshUserBaseBalance.update(n => n + 1);

		// show new trades in UI
		sessionTrades.update((arr) => {
			let formattedTrade = formatTrades([ev.args], ev.blockNumber, ev.transactionHash)[0];
			arr.unshift(formattedTrade);
			return arr;
		});
		
	} else if (ev.event == 'CancelOrder') {
		// From TX checker only
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
	}

}

export function initEventListeners(address, chainId) {
	const tradingContract = getContract();
	if (!tradingContract) return;
	tradingContract.removeAllListeners();
	if (!address || !chainId) return;

	tradingContract.on(tradingContract.filters.NewPosition(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, address), handleEvent);

}

// Below are for when graph data is delayed, to get recent orders/TXs

let history_cache = {timestamp: 0, items: []};

export async function fetchPositionIdsFromEvents(address) {

	console.log('fetchPositionIdsFromEvents', address);

	// get recent past OpenOrder, NewPosition and ClosePosition events and determine which position ids are still active for this user
	// populate history using closeposition events

	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;

	const filter_open = tradingContract.filters.OpenOrder(null, address);
	const _events_open = await tradingContract.queryFilter(filter_open, -10000);

	console.log('_events_open', _events_open);

	const filter_new = tradingContract.filters.NewPosition(null, address);
	const _events_new = await tradingContract.queryFilter(filter_new, -10000);

	console.log('_events_new', _events_new);
	let formattedHistoryEvents = await fetchHistoryEvents(address);
	let full_close_ids = {};
	for (const ev of formattedHistoryEvents) {
		if (ev.isFullClose) full_close_ids[ev.positionId] = true;
	}

	history_cache.timestamp = Date.now();
	history_cache.items = formattedHistoryEvents;

	let new_position_ids = {};
	for (let ev of _events_open) {
		let positionId = ev.args.positionId && ev.args.positionId.toNumber();
		if (!full_close_ids[positionId]) new_position_ids[positionId] = true;
	}
	for (let ev of _events_new) {
		let positionId = ev.args.positionId && ev.args.positionId.toNumber();
		if (!full_close_ids[positionId]) new_position_ids[positionId] = true;
	}

	console.log('new_position_ids', new_position_ids);

	return Object.keys(new_position_ids);

}

export async function fetchHistoryEvents(address) {

	console.log('fetchHistoryEvents', address);

	if (!address) return [];

	if (history_cache.timestamp > Date.now() - 3*1000) {
		return history_cache.items;
	}

	const tradingContract = getContract();
	if (!tradingContract) return [];
	const filter = tradingContract.filters.ClosePosition(null, address);
	const _events = await tradingContract.queryFilter(filter, -10000);
	let formattedEvents = [];
	for (const ev of _events) {
		formattedEvents.unshift(formatEvent(ev));
	}
	return formattedEvents;
}