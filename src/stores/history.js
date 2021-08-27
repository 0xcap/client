import { writable, derived } from 'svelte/store'
import { fetchHistoryEvents } from '../lib/events'
import { selectedAddress } from './wallet'
import { selectedBaseId } from './bases'

export const refreshUserHistory = writable(0);

export const history = derived([selectedBaseId, selectedAddress, refreshUserHistory], async ([$selectedBaseId, $selectedAddress, refreshUserHistory], set) => {
	if (!$selectedBaseId || !$selectedAddress) {
		set([]);
		return;
	}
	set(await fetchHistoryEvents($selectedAddress));
},[]);