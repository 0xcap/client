import { writable, derived } from 'svelte/store'
import { getUserPositions } from '../lib/methods'
import { address } from './provider'
import { baseId } from './order'

export const refreshUserPositions = writable(0);

export const positions = derived([baseId, address, refreshUserPositions], async ([$baseId, $address, $refreshUserPositions], set) => {
	if (!$baseId || !$address) {
		set([]);
		return;
	}
	const pos = await getUserPositions($baseId, $address);
	console.log('got user positions', pos);
	set(pos);
},[]);