import { writable, derived } from 'svelte/store'
import { getPositions } from '../lib/methods'

import { fetchPositionIdsFromEvents } from '../lib/events'

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
		const position_ids = [];//await getPositionIDs($selectedAddress);
		// tmp when graph doesn't work
		const _position_ids = await fetchPositionIdsFromEvents($selectedAddress);

		const all_pos_ids = (position_ids || []).concat(_position_ids || []);
		if (all_pos_ids.length) sessionPositionIds.set(all_pos_ids);
		
		return;
	}
	set(await getPositions($sessionPositionIds));
},[]);