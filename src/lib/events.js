import { get } from 'svelte/store'

import { getContract } from './helpers'

import { refreshUserStaked } from '../stores/vault'
import { refreshUserPositions } from '../stores/positions'
import { refreshUserBaseAllowance, refreshUserBaseBalance, userBaseAllowance } from '../stores/wallet'
import { refreshUserHistory } from '../stores/history'
import { showToast } from '../stores/toasts'

import { completeTransaction } from '../stores/transactions'

import { formatEvent } from './utils'
	
// toasts dark for a period after page load
let acceptToasts = false;
setTimeout(() => {
	acceptToasts = true;
}, 4000);

function handleEvent() {

	const ev = arguments[arguments.length - 1];

	//console.log('got event', ev);
	
	if (ev.event == 'NewPosition') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		if (acceptToasts) showToast('Position opened.', 'success');
	}

	if (ev.event == 'Staked') {
		completeTransaction(ev.transactionHash);
		refreshUserStaked.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
		if (acceptToasts) showToast('Staked.', 'success');
	}

	if (ev.event == 'Redeemed') {
		completeTransaction(ev.transactionHash);
		refreshUserStaked.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
		if (acceptToasts) showToast('Redeemed.', 'success');
	}

	if (ev.event == 'Approval') { // ERC20. Is sent on transferFrom
		completeTransaction(ev.transactionHash);
		refreshUserBaseAllowance.update(n => n + 1);
		if (acceptToasts && !get(userBaseAllowance)) showToast('Approved.', 'success');
	}

	if (ev.event == 'Transfer') { // ERC20
		completeTransaction(ev.transactionHash);
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'AddMargin') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		if (acceptToasts) showToast('Margin added.', 'success');
	}

	if (ev.event == 'ClosePosition') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
		refreshUserHistory.update(n => n + 1);
		if (acceptToasts) showToast('Position closed.', 'success');
	}

	if (ev.event == 'NewPositionSettled') {
		refreshUserPositions.update(n => n + 1);
	}

}

export function initEventListeners(address, chainId) {
	const tradingContract = getContract();
	if (!tradingContract) return;
	tradingContract.removeAllListeners();
	if (!address || !chainId) return;
	
	tradingContract.on(tradingContract.filters.Staked(address), handleEvent);
	tradingContract.on(tradingContract.filters.Redeemed(address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPosition(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPositionSettled(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.AddMargin(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, address), handleEvent);
	// todo: other event listeners

	const USDCContract = getContract('USDC');
	if (!USDCContract) return;
	USDCContract.removeAllListeners();
	USDCContract.on(USDCContract.filters.Approval(address, tradingContract.address), handleEvent);
	USDCContract.on(USDCContract.filters.Transfer(address, null), handleEvent);
	USDCContract.on(USDCContract.filters.Transfer(null, address), handleEvent);
}


export async function fetchHistoryEvents(address) {
	if (!address) return;
	const tradingContract = getContract();
	if (!tradingContract) return;
	const filter = tradingContract.filters.ClosePosition(null, address);
	const _events = await tradingContract.queryFilter(filter, -170000); // last 170K blocks, eg 30 days
	let formattedEvents = [];
	let i = 0;
	for (const ev of _events) {
		i++;
		formattedEvents.unshift(formatEvent(ev));
		if (i == 100) break; // 100 first events only
	}
	//console.log('formattedEvents', formattedEvents);
	return formattedEvents;
	// possibly use graph protocol for more efficient queries later
}