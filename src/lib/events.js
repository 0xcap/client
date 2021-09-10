import { get } from 'svelte/store'

import { getContract } from './helpers'

import { refreshUserStakes, refreshUserStakeIds, refreshSelectedVault } from '../stores/vault'
import { refreshUserPositions, refreshUserPositionIds } from '../stores/positions'
import { refreshUserBaseBalance, userBaseAllowance, selectedAddress } from '../stores/wallet'
import { refreshUserHistory, history } from '../stores/history'
import { showToast } from '../stores/toasts'

import { completeTransaction } from '../stores/transactions'

import { formatEvent } from './utils'
	
// toasts dark for a period after page load
let acceptToasts = false;
setTimeout(() => {
	acceptToasts = true;
}, 4000);

let handled_cache = {};

export async function handleTransactionEvent(ev) {
	handleEvent(ev);
}

async function handleEvent() {

	const ev = arguments[arguments.length - 1];

	//console.log('got event', Date.now(), ev);

	if (handled_cache[ev.transactionHash]) return;
	handled_cache[ev.transactionHash] = true;
	
	if (ev.event == 'NewPosition') {
		completeTransaction(ev.transactionHash);
		refreshUserPositionIds.update(n => n + 1);
		if (acceptToasts) showToast('Position opened.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'AddMargin') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		if (acceptToasts) showToast('Margin added.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'ClosePosition') {
		completeTransaction(ev.transactionHash);
		
		if (ev.args.isFullClose) {
			refreshUserPositionIds.update(n => n + 1);
		} else {
			refreshUserPositions.update(n => n + 1);
		}

		refreshUserHistory.update(n => n + 1);
		
		if (acceptToasts) {
			if (ev.args.wasLiquidated) {
				showToast('Position was liquidated.', 'info');
			} else {
				showToast('Position closed.', 'success');
			}
		}

		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'NewPositionSettled') {
		refreshUserPositions.update(n => n + 1);
	}

	if (ev.event == 'Staked') {
		completeTransaction(ev.transactionHash);
		refreshUserStakeIds.update(n => n + 1);
		refreshSelectedVault.update(n => n + 1);
		if (acceptToasts) showToast('Staked.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'Redeemed') {
		completeTransaction(ev.transactionHash);
		refreshSelectedVault.update(n => n + 1);
		if (ev.args.isFullRedeem) {
			refreshUserStakeIds.update(n => n + 1);
		} else {
			refreshUserStakes.update(n => n + 1);
		}
		if (acceptToasts) showToast('Redeemed.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	}

}

export function initEventListeners(address, chainId) {
	const tradingContract = getContract();
	if (!tradingContract) return;
	tradingContract.removeAllListeners();
	if (!address || !chainId) return;
	
	tradingContract.on(tradingContract.filters.Staked(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.Redeemed(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPosition(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPositionSettled(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.AddMargin(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, address), handleEvent);

}

let history_cache = {timestamp: 0, items: []};

export async function fetchPositionIds(address) {

	// get past NewPosition and ClosePosition events and determine which position ids are still active for this user
	// populate history using closeposition events

	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;

	const filter_new = tradingContract.filters.NewPosition(null, address);
	const _events_new = await tradingContract.queryFilter(filter_new, -70000); // last 510K blocks, eg 90 days

	let formattedHistoryEvents = await fetchHistoryEvents(address);
	let full_close_ids = {};
	for (const ev of formattedHistoryEvents) {
		if (ev.isFullClose) full_close_ids[ev.positionId] = true;
	}

	history_cache.timestamp = Date.now();
	history_cache.items = formattedHistoryEvents;

	let new_position_ids = {};
	for (let ev of _events_new) {
		ev = formatEvent(ev);
		if (!full_close_ids[ev.positionId]) new_position_ids[ev.positionId] = true;
	}

	return Object.keys(new_position_ids);

}

export async function fetchHistoryEvents(address) {
	if (!address) return [];

	if (history_cache.timestamp > Date.now() - 3*1000) {
		return history_cache.items;
	}

	const tradingContract = getContract();
	if (!tradingContract) return [];
	const filter = tradingContract.filters.ClosePosition(null, address);
	const _events = await tradingContract.queryFilter(filter, -70000); // last 90 days
	let formattedEvents = [];
	for (const ev of _events) {
		formattedEvents.unshift(formatEvent(ev));
	}
	return formattedEvents;
}

export async function fetchStakeIds(address) {

	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;

	const filter_redeemed = tradingContract.filters.Redeemed(null, address);
	const _events_redeemed = await tradingContract.queryFilter(filter_redeemed, -70000); // last 510K blocks, eg 90 days

	let full_redeemed_ids = {};
	for (let ev of _events_redeemed) {
		ev = formatEvent(ev);
		if (ev.isFullRedeem) full_redeemed_ids[ev.stakeId] = true;
	}

	const filter_staked = tradingContract.filters.Staked(null, address);
	const _events_staked = await tradingContract.queryFilter(filter_staked, -70000); // last 510K blocks, eg 90 days

	let new_stake_ids = {};
	for (let ev of _events_staked) {
		ev = formatEvent(ev);
		if (!full_redeemed_ids[ev.stakeId]) new_stake_ids[ev.stakeId] = true;
	}

	return Object.keys(new_stake_ids);

}