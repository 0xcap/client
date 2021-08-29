import { writable, derived } from 'svelte/store'
import { getUserPositions } from '../lib/methods'

import { selectedBaseId } from './bases'
import { selectedAddress } from './wallet'

export const refreshUserPositions = writable(0);

export const positions = derived([selectedBaseId, selectedAddress, refreshUserPositions], async ([$selectedBaseId, $selectedAddress, $refreshUserPositions], set) => {
	if (!$selectedBaseId || !$selectedAddress) {
		set([]);
		return;
	}
	set(await getUserPositions($selectedBaseId, $selectedAddress));
},[]);