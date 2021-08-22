import { get } from 'svelte/store'
import { contract } from './contracts'
import { PRICE_DECIMALS, LEVERAGE_DECIMALS } from './constants'
import { getBaseInfo, getProductSymbol } from './contracts'
import { provider, signer } from '../stores/provider'

import { refreshUserStaked } from '../stores/vault'
import { refreshUserPositions } from '../stores/positions'
import { refreshUserBaseAllowance, refreshUserBaseBalance } from '../stores/wallet'
import { refreshUserHistory } from '../stores/history'

import { completeTransaction } from '../stores/transactions'

import { toBytes32, fromBytes32, formatUnits, parseUnits, formatBaseAmount } from './utils'

function handleEvent() {

	const ev = arguments[arguments.length - 1];

	console.log('got event', ev);
	
	if (ev.event == 'NewPosition') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
	}

	if (ev.event == 'Staked') {
		completeTransaction(ev.transactionHash);
		refreshUserStaked.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'Unstaked') {
		completeTransaction(ev.transactionHash);
		refreshUserStaked.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
	}

	if (ev.event == 'Approval') { // ERC20
		completeTransaction(ev.transactionHash);
		refreshUserBaseAllowance.update(n => n + 1);
	}

	if (ev.event == 'AddMargin') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
	}

	if (ev.event == 'ClosePosition') {
		completeTransaction(ev.transactionHash);
		refreshUserPositions.update(n => n + 1);
		refreshUserBaseBalance.update(n => n + 1);
		refreshUserHistory.update(n => n + 1);
	}

	if (ev.event == 'NewPositionSettled') {
		refreshUserPositions.update(n => n + 1);
	}

}

export function initEventListeners(address, chainId) {
	const tradingContract = contract();
	if (!tradingContract) return;
	tradingContract.removeAllListeners();
	if (!address || !chainId) return;
	
	tradingContract.on(tradingContract.filters.Staked(address), handleEvent);
	tradingContract.on(tradingContract.filters.Unstaked(address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPosition(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.NewPositionSettled(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.AddMargin(null, address), handleEvent);
	tradingContract.on(tradingContract.filters.ClosePosition(null, address), handleEvent);
	// todo: other event listeners

	const USDCContract = contract('USDC');
	if (!USDCContract) return;
	USDCContract.removeAllListeners();
	USDCContract.on(USDCContract.filters.Approval(address, tradingContract.address), handleEvent);
}

const formatEvent = function(ev) {

	//console.log('Formatting event', ev);

	if (ev.event == 'ClosePosition') {

		const { id, user, baseId, productId, priceWithFee, margin, leverage, pnl, wasLiquidated } = ev.args;

		const base = getBaseInfo(baseId);
		if (!base) return;

		return {
			type: 'ClosePosition',
			id: id.toNumber(),
			base: base.symbol,
			product: getProductSymbol(productId),
			priceWithFee: formatUnits(priceWithFee, PRICE_DECIMALS),
			margin: formatUnits(margin, base.decimals),
			leverage: formatUnits(leverage, LEVERAGE_DECIMALS),
			amount: formatBaseAmount(formatUnits(margin, base.decimals) * formatUnits(leverage, LEVERAGE_DECIMALS), baseId),
			pnl: formatUnits(pnl, base.decimals),
			wasLiquidated,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId,
			baseId: baseId
		};

	}

}

export async function fetchHistoryEvents(address) {
	if (!address) return;
	const tradingContract = contract();
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
	return formattedEvents;
	// possibly use graph protocol for more efficient queries later
}