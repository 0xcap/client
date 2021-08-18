import { writable, derived } from 'svelte/store'
import { getBaseInfo } from '../lib/contracts'
import { getProductInfo, getUserBaseBalance, getUserBaseAllowance, getUserStaked } from '../lib/methods'

import { address } from './provider'

export const refreshUserBaseBalance = writable(0);
export const refreshUserBaseAllowance = writable(0);

export const baseId = writable(1);
export const productId = writable(1);

export const baseInfo = derived(baseId, ($baseId) => {
	return getBaseInfo($baseId);
});

export const productInfo = derived(productId, async ($productId, set) => {
	set(await getProductInfo($productId));
}, {});

export const userBaseBalance = derived([baseId, address, refreshUserBaseBalance], async ([$baseId, $address, $refreshUserBaseBalance], set) => {
	if (!$baseId || !$address) {
		set(0);
		return;
	}
	set(await getUserBaseBalance($baseId, $address));
}, 0);

export const userBaseAllowance = derived([baseId, address, refreshUserBaseAllowance], async ([$baseId, $address, $refreshUserBaseAllowance], set) => {
	if (!$baseId || !$address) {
		set(0);
		return;
	}
	set(await getUserBaseAllowance($baseId, $address));
}, 0);