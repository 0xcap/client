import { writable, derived } from 'svelte/store'

import { selectedAddress } from './wallet'

import { fetchStakeIds } from '../lib/events'
import { getStakes, getVault } from '../lib/methods'

export const refreshSelectedVault = writable(0);
export const refreshUserStakes = writable(0);
export const refreshUserStakeIds = writable(0);

export const selectedVault = derived([refreshSelectedVault], async ([$refreshSelectedVault], set) => {
	set(await getVault());
}, 0);

export const activeStakeIds = derived([selectedAddress, refreshUserStakeIds], async ([$selectedAddress, $refreshUserStakeIds], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	set(await fetchStakeIds($selectedAddress));
},[]);

export const stakes = derived([selectedAddress, activeStakeIds, refreshUserStakes], async ([$selectedAddress, $activeStakeIds, $refreshUserStakes], set) => {
	if (!$selectedAddress || !$activeStakeIds.length) {
		set([]);
		return;
	}
	set(await getStakes($activeStakeIds));
}, []);

export const userStaked = derived([stakes], ([$stakes], set) => {
	if (!$stakes.length) {
		set(0);
		return;
	}
	let sum = 0;
	for (const stake of $stakes) {
		sum += stake.amount * 1;
	}
	set(sum);
}, 0);