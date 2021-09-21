import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { getContract } from './helpers'

import { refreshUserStakes, refreshSelectedVault, sessionStakeIds } from '../stores/vault'
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

let handled_cache = {};

export async function handleTransactionEvent(ev) {
	handleEvent(ev);
}

async function handleEvent() {

	const ev = arguments[arguments.length - 1];

	//console.log('got event', Date.now(), ev);

	if (handled_cache[ev.transactionHash] && ev.event != 'ClosePosition') return;

	//console.log('handling event', ev);
	
	if (ev.event == 'NewPosition') {
		completeTransaction(ev.transactionHash);
		let position_id;
		if (ev.txReceipt) {
			// get position id from here, add it to session ids
			position_id = ethers.utils.defaultAbiCoder.decode([ 'uint256' ], ev.txReceipt.logs[0].topics[1])[0].toNumber();
		} else {
			// get position id from ev.args, add it to session ids
			position_id = ev.args.positionId.toNumber();
		}
		sessionPositionIds.update((arr) => {
			arr.push(position_id);
			return arr;
		});
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
		
		if (!handled_cache[ev.transactionHash]) {

			if (ev.args.isFullClose) {
				let position_id;
				if (ev.txReceipt) {
					position_id = ev.args.positionId;
				} else {
					position_id = ev.args.positionId.toNumber();
				}
				sessionPositionIds.update((arr) => {
					arr = arr.filter((value) => {
						return value != position_id;
					});
					return arr;
				});
			} else {
				refreshUserPositions.update(n => n + 1);
			}
			
			if (acceptToasts) {
				if (ev.args.wasLiquidated) {
					showToast('Position was liquidated.', 'info');
				} else {
					showToast('Position closed.', 'success');
				}
			}

			refreshUserBaseBalance.update(n => n + 1);

		}

		// show new trades in UI
		if (!ev.txReceipt) {
			sessionTrades.update((arr) => {
				let formattedTrade = formatTrades([ev.args], ev.blockNumber, ev.transactionHash)[0];
				arr.unshift(formattedTrade);
				return arr;
			});
		}
		
	}

	if (ev.event == 'NewPositionSettled') {
		refreshUserPositions.update(n => n + 1);
	}

	if (ev.event == 'Staked') {
		completeTransaction(ev.transactionHash);
		refreshSelectedVault.update(n => n + 1);
		if (acceptToasts) showToast('Staked.', 'success');
		refreshUserBaseBalance.update(n => n + 1);

		let stake_id = ev.args.stakeId && ev.args.stakeId.toNumber();
		if (stake_id) {
			sessionStakeIds.update((arr) => {
				arr.push(stake_id);
				return arr;
			});
		}

	}

	if (ev.event == 'Redeemed') {
		completeTransaction(ev.transactionHash);
		refreshSelectedVault.update(n => n + 1);
		if (ev.args.isFullRedeem) {
			let stake_id = ev.args.stakeId && ev.args.stakeId.toNumber();
			sessionStakeIds.update((arr) => {
				arr = arr.filter((value) => {
					return value != stake_id;
				});
				return arr;
			});
		} else {
			refreshUserStakes.update(n => n + 1);
		}
		if (acceptToasts) showToast('Redeemed.', 'success');
		refreshUserBaseBalance.update(n => n + 1);
	}

	handled_cache[ev.transactionHash] = true;

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

export async function fetchPositionIdsFromEvents(address) {

	// get past NewPosition and ClosePosition events and determine which position ids are still active for this user
	// populate history using closeposition events

	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;

	const filter_new = tradingContract.filters.NewPosition(null, address);
	const _events_new = await tradingContract.queryFilter(filter_new, -10000);

	let formattedHistoryEvents = await fetchHistoryEvents(address);
	let full_close_ids = {};
	for (const ev of formattedHistoryEvents) {
		if (ev.isFullClose) full_close_ids[ev.positionId] = true;
	}

	history_cache.timestamp = Date.now();
	history_cache.items = formattedHistoryEvents;

	let new_position_ids = {};
	for (let ev of _events_new) {
		let positionId = ev.args.positionId && ev.args.positionId.toNumber();
		if (!full_close_ids[positionId]) new_position_ids[positionId] = true;
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
	const _events = await tradingContract.queryFilter(filter, -10000);
	let formattedEvents = [];
	for (const ev of _events) {
		formattedEvents.unshift(formatEvent(ev));
	}
	return formattedEvents;
}