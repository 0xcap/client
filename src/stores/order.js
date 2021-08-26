import { writable, derived } from 'svelte/store'
import { userBaseBalance } from './wallet'

export const amount = writable();
export const leverage = writable(getCachedLeverage(1) || 100);

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