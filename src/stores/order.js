import { writable, derived } from 'svelte/store'
import { userBaseBalance } from './wallet'
import { getCachedLeverage } from '../lib/utils'

export const amount = writable();
export const leverage = writable(getCachedLeverage(1) || 25);

export const margin = derived([amount, leverage], ([$amount, $leverage]) => {
	if (!$amount || !$leverage) return 0;
	return ($amount || 0) / $leverage;
}, 0);

export const buyingPower = derived([userBaseBalance, leverage], ([$userBaseBalance, $leverage]) => {
	if (!$userBaseBalance || !$leverage) return 0;
	return $userBaseBalance * $leverage;
}, 0);

