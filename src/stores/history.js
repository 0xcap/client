import { writable, derived } from 'svelte/store'
import { fetchHistoryEvents } from '../lib/events'
import { address } from './provider'
import { baseId } from './order'

export const refreshUserHistory = writable(0);

export const history = derived([baseId, address, refreshUserHistory], async ([$baseId, $address, refreshUserHistory], set) => {
	if (!$baseId || !$address) {
		set([]);
		return;
	}
	const his = await fetchHistoryEvents($address);
	console.log('got history', his);
	set(his);
},[]);