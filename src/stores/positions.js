import { writable, derived } from 'svelte/store'
import { getPositions } from '../lib/methods'

import { getPositionIDs } from '../lib/api'

import { selectedAddress } from './wallet'

export const refreshUserPositions = writable(0);

export const sessionPositionIds = writable([]);

export const positions = derived([selectedAddress, sessionPositionIds, refreshUserPositions], async ([$selectedAddress, $sessionPositionIds, $refreshUserPositions], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	if (!$sessionPositionIds.length) {
		// first load, fetch position ids for user
		const position_ids = await getPositionIDs($selectedAddress);
		if (position_ids.length) sessionPositionIds.set(position_ids);
		return;
	}
	set(await getPositions($sessionPositionIds));
},[]);