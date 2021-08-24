import { writable, derived } from 'svelte/store'

import { signer, address } from './provider'
import { baseId } from './bases'

import { getBaseInfo } from '../lib/contracts'
import { getUserStaked, getVault } from '../lib/methods'

export const refreshUserStaked = writable(0);

export const vaultInfo = derived([baseId], async ([baseId], set) => {
	if (!baseId) {
		set({});
		return;
	}
	set(await getVault(baseId));
}, 0);

export const userStaked = derived([baseId, address, refreshUserStaked], async ([baseId, $address, $refreshUserStaked], set) => {
	if (!baseId || !$address) {
		set(0);
		return;
	}
	set(await getUserStaked($address, baseId) || 0);
}, 0);