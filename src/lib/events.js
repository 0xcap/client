import { get } from 'svelte/store'
import { ethers } from 'ethers'

import { getContract } from './helpers'

import { refreshUserStakes, refreshUserStakeIds, refreshSelectedVault } from '../stores/vault'
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

export async function fetchStakeIds(address) {

	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;

	const filter_redeemed = tradingContract.filters.Redeemed(null, address);
	const _events_redeemed = await tradingContract.queryFilter(filter_redeemed, -150000);

	let full_redeemed_ids = {};
	for (let ev of _events_redeemed) {
		ev = formatEvent(ev);
		if (ev.isFullRedeem) full_redeemed_ids[ev.stakeId] = true;
	}

	const filter_staked = tradingContract.filters.Staked(null, address);
	const _events_staked = await tradingContract.queryFilter(filter_staked, -150000); // last 510K blocks, eg 90 days

	//console.log('_events_staked', _events_staked);
	let new_stake_ids = {};
	for (let ev of _events_staked) {
		ev = formatEvent(ev);
		if (!full_redeemed_ids[ev.stakeId]) new_stake_ids[ev.stakeId] = true;
	}

	return Object.keys(new_stake_ids);

}