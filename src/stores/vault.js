import { writable, derived } from 'svelte/store'

import { selectedAddress } from './wallet'

import { getStakeIDs } from '../lib/api'
import { getStakes, getVault } from '../lib/methods'

export const refreshSelectedVault = writable(0);
export const refreshUserStakes = writable(0);
export const refreshUserStakeIds = writable(0);

export const selectedVault = derived([refreshSelectedVault], async ([$refreshSelectedVault], set) => {
	set(await getVault());
}, 0);


export const sessionStakeIds = writable([]);

export const stakes = derived([selectedAddress, sessionStakeIds, refreshUserStakes], async ([$selectedAddress, $sessionStakeIds, $refreshUserStakes], set) => {
	if (!$selectedAddress) {
		set([]);
		return;
	}
	if (!$sessionStakeIds.length) {
		// first load, fetch stake ids for user
		const stake_ids = await getStakeIDs($selectedAddress);
		if (stake_ids.length) sessionStakeIds.set(stake_ids);
		return;
	}
	set(await getStakes($sessionStakeIds));
},[]);

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