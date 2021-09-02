import { writable, derived } from 'svelte/store'
import { getUserPositions } from '../lib/methods'

import { selectedAddress } from './wallet'

export const refreshUserPositions = writable(0);

export const positions = derived([selectedAddress, refreshUserPositions], async ([$selectedAddress, $refreshUserPositions], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	set(await getUserPositions($selectedAddress));
},[]);