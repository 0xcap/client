import { writable, derived } from 'svelte/store'

import { signer, address } from './provider'
import { baseId } from './order'

import { getBaseInfo } from '../lib/contracts'
import { getUserStaked, getVaultCap, getVaultBalance, getVaultTotalStaked } from '../lib/methods'

export const refreshUserStaked = writable(0);

export const userStaked = derived([baseId, address, refreshUserStaked], async ([baseId, $address, $refreshUserStaked], set) => {
	if (!baseId || !$address) {
		set(0);
		return;
	}
	set(await getUserStaked(baseId, $address));
}, 0);

export const vaultCap = derived([baseId], async ([baseId], set) => {
	if (!baseId) {
		set(0);
		return;
	}
	set(await getVaultCap(baseId));
}, 0);

let c1;
export const vaultBalance = derived([baseId], async ([baseId], set) => {
	clearInterval(c1);
	if (!baseId) {
		set(0);
		return;
	}
	c1 = setInterval(async () => {
		set(await getVaultBalance(baseId));
	}, 10 * 1000);
	set(await getVaultBalance(baseId));
}, 0);

let c2;
export const vaultTotalStaked = derived([baseId, refreshUserStaked], async ([baseId, refreshUserStaked], set) => {
	clearInterval(c2);
	if (!baseId) {
		set(0);
		return;
	}
	c2 = setInterval(async () => {
		set(await getVaultTotalStaked(baseId));
	}, 10 * 1000);
	set(await getVaultTotalStaked(baseId));
}, 0);