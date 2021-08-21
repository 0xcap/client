import { writable, derived } from 'svelte/store'
import { getBaseInfo } from '../lib/contracts'
import { getProductInfo } from '../lib/methods'

import { address } from './provider'
import { userBaseBalance } from './wallet'

export function getCachedLeverage(_productId) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		try {
			cl = JSON.parse(cl);
			return cl[_productId] * 1;
		} catch(e) {}
	}
}

export function setCachedLeverage(_productId, _leverage) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		cl = JSON.parse(cl);
		cl[_productId] = _leverage * 1;
		localStorage.setItem('cachedLeverages', JSON.stringify(cl));
	} else {
		localStorage.setItem('cachedLeverages', JSON.stringify({[_productId]: _leverage}));
	}
}

export const productId = writable(localStorage.getItem('productId') || 2);
export const amount = writable();
export const leverage = writable(getCachedLeverage(1) || 100);

export const productInfo = derived(productId, async ($productId, set) => {
	const pi = await getProductInfo($productId);
	if (!pi) return;

	leverage.set(getCachedLeverage($productId) || pi.leverage * 1);
	set(pi);
}, {});

export const margin = derived([amount, leverage], ([$amount, $leverage]) => {
	if (!$amount || !$leverage) return 0;
	const m = ($amount || 0) / $leverage;
	if (m < 100) {
		return m.toFixed(2);
	} else {
		return Math.ceil(m);
	}
}, 0);

export const buyingPower = derived([userBaseBalance, leverage], ([$userBaseBalance, $leverage]) => {
	if (!$userBaseBalance || !$leverage) return 0;
	return Math.floor($userBaseBalance * $leverage);
}, 0);