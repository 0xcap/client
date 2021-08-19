import { writable, derived } from 'svelte/store'
import { address } from './provider'
import { baseId } from './bases'

import { getUserBaseBalance, getUserBaseAllowance } from '../lib/methods'

export const refreshUserBaseBalance = writable(0);
export const refreshUserBaseAllowance = writable(0);

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