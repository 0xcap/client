import { writable, derived } from 'svelte/store'
import { fetchHistoryEvents } from '../lib/events'
import { address } from './provider'
import { baseId } from './bases'

export const refreshUserHistory = writable(0);

export const history = derived([baseId, address, refreshUserHistory], async ([$baseId, $address, refreshUserHistory], set) => {
	if (!$baseId || !$address) {
		set([]);
		return;
	}
	const his = await fetchHistoryEvents($address);
	set(his);
},[]);