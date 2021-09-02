import { writable, derived } from 'svelte/store'

import { signer, selectedAddress } from './wallet'

import { getUserStaked, getVault } from '../lib/methods'

export const refreshSelectedVault = writable(0);
export const refreshUserStaked = writable(0);

export const selectedVault = derived([refreshSelectedVault], async ([$refreshSelectedVault], set) => {
	set(await getVault());
}, 0);

export const userStaked = derived([selectedAddress, refreshUserStaked], async ([$selectedAddress, $refreshUserStaked], set) => {
	if (!$selectedAddress) {
		set(0);
		return;
	}
	set(await getUserStaked($selectedAddress) || 0);
}, 0);