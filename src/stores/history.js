import { writable, derived } from 'svelte/store'
import { selectedAddress } from './wallet'

import { getTrades } from '../lib/api'
import { fetchHistoryEvents } from '../lib/events'

export const sessionTrades = writable([]);

export const history = derived([selectedAddress], async ([$selectedAddress], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	//set(await getTrades($selectedAddress));
	set(await fetchHistoryEvents($selectedAddress));
},[]);