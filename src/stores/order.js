import { writable, derived } from 'svelte/store'
import { userBaseBalance } from './wallet'
import { getCachedLeverage } from '../lib/utils'

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

