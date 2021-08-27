import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { bases, selectedBaseId } from '../stores/bases'
import { products, selectedProductId } from '../stores/products'

import { activateProductPrices } from './helpers'
import { LEVERAGE_DECIMALS, PRICE_DECIMALS } from './constants'

export function formatUnits(number, units) {
  if (!units) units = 6; // usdc
  return ethers.utils.formatUnits(number || 0, units);
}
export function parseUnits(number, units) {
  if (!units) units = 6; // usdc
  if (typeof(number) == 'number') number = number.toString();
  return ethers.utils.parseUnits(number, units);
}

export function shortAddr(_address) {
	if (!_address) return;
	return _address.substring(0,6) + '...' + _address.slice(-4);
}

export function formatToDisplay(amount, baseId) {
	if (amount * 1 >= 1000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 100) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 10) {
		return (amount * 1).toFixed(4);
	} else {
		return (amount * 1).toFixed(6);
	}
}

export function formatPositions(positions, baseId) {
	const base = get(bases)[baseId];
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			id: p.id.toNumber(),
			base: base.symbol,
			product: get(products)[p.productId],
			timestamp: p.timestamp.toNumber(),
			isLong: p.isLong,
			isSettling: p.isSettling,
			margin: formatUnits(p.margin, base.decimals),
			leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
			amount: formatUnits(p.margin, base.decimals) * formatUnits(p.leverage, LEVERAGE_DECIMALS),
			price: formatUnits(p.price, PRICE_DECIMALS),
			liquidationPrice: formatUnits(p.liquidationPrice, PRICE_DECIMALS),
			productId: p.productId,
			baseId: baseId
		});
		activateProductPrices(p.productId);
	}
	formattedPositions.reverse();
	return formattedPositions;
}

export function formatVault(v, baseId) {
	const base = get(bases)[baseId];
	if (!base) return;
	return {
		id: baseId,
		symbol: base.symbol,
		cap: formatUnits(v.cap),
		maxOpenInterest: formatUnits(v.maxOpenInterest),
		maxDailyDrawdown: formatUnits(v.maxDailyDrawdown, 2),
		stakingPeriod: v.stakingPeriod,
		redemptionPeriod: v.redemptionPeriod,
		protocolFee: formatUnits(v.protocolFee,2),
		openInterest: formatUnits(v.openInterest),
		balance: formatUnits(v.balance),
		totalStaked: formatUnits(v.totalStaked),
		isActive: v.isActive
	}
}

export function formatProduct(p, productId) {
	return {
		symbol: get(products)[productId],
		leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
		fee: formatUnits(p.fee, 2),
		interest: formatUnits(p.interest, 2),
		feed: p.feed,
		settlementTime: p.settlementTime,
		minTradeDuration: p.minTradeDuration,
		liquidationThreshold: formatUnits(p.liquidationThreshold, 2),
		liquidationBounty: formatUnits(p.liquidationBounty, 2),
		isActive: p.isActive
	}
}

export function formatEvent(ev) {

	if (ev.event == 'ClosePosition') {

		const { id, user, vaultId, productId, price, margin, leverage, pnl, feeRebate, protocolFee, wasLiquidated } = ev.args;

		const base = get(bases)[vaultId];
		if (!base) return;

		return {
			type: 'ClosePosition',
			id: id.toNumber(),
			base: base.symbol,
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			margin: formatUnits(margin, base.decimals),
			leverage: formatUnits(leverage, LEVERAGE_DECIMALS),
			amount: formatUnits(margin, base.decimals) * formatUnits(leverage, LEVERAGE_DECIMALS),
			pnl: formatUnits(pnl, base.decimals),
			feeRebate: formatUnits(feeRebate, base.decimals),
			protocolFee: formatUnits(protocolFee, base.decimals),
			wasLiquidated,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId,
			vaultId: vaultId
		};

	}

}

export function getCachedLeverage(productId) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		try {
			cl = JSON.parse(cl);
			return cl[productId] * 1;
		} catch(e) {}
	}
}

export function setCachedLeverage(productId, _leverage) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		cl = JSON.parse(cl);
		cl[productId] = _leverage * 1;
		localStorage.setItem('cachedLeverages', JSON.stringify(cl));
	} else {
		localStorage.setItem('cachedLeverages', JSON.stringify({[productId]: _leverage}));
	}
}