import { writable, derived } from 'svelte/store'
import { fetchHistoryEvents } from '../lib/events'
import { selectedAddress } from './wallet'

export const refreshUserHistory = writable(0);

export const history = derived([selectedAddress, refreshUserHistory], async ([$selectedAddress, $refreshUserHistory], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	set(await fetchHistoryEvents($selectedAddress));
},[]);