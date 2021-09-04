import { writable, derived } from 'svelte/store'
import { fetchPositionIds } from '../lib/events'
import { getPositions } from '../lib/methods'

import { selectedAddress } from './wallet'

export const refreshUserPositions = writable(0);
export const refreshUserPositionIds = writable(0);

export const activePositionIds = derived([selectedAddress, refreshUserPositionIds], async ([$selectedAddress, $refreshUserPositionIds], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	set(await fetchPositionIds($selectedAddress));
},[]);

export const positions = derived([selectedAddress, activePositionIds, refreshUserPositions], async ([$selectedAddress, $activePositionIds, $refreshUserPositions], set) => {
	if (!$selectedAddress || !$activePositionIds.length) {
		set([]);
		return;
	}
	set(await getPositions($activePositionIds));
},[]);