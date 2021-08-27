import { writable, derived } from 'svelte/store'

import { selectedBaseId } from './bases'
import { signer, selectedAddress } from './wallet'

import { getUserStaked, getVault } from '../lib/methods'

export const refreshUserStaked = writable(0);

export const vaultInfo = derived([selectedBaseId], async ([$selectedBaseId], set) => {
	if (!$selectedBaseId) {
		set({});
		return;
	}
	set(await getVault($selectedBaseId));
}, 0);

export const userStaked = derived([selectedBaseId, selectedAddress, refreshUserStaked], async ([$selectedBaseId, $selectedAddress, $refreshUserStaked], set) => {
	if (!$selectedBaseId || !$selectedAddress) {
		set(0);
		return;
	}
	set(await getUserStaked($selectedBaseId, $selectedAddress) || 0);
}, 0);