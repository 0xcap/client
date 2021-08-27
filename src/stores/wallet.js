import { writable, derived } from 'svelte/store'
import { selectedBaseId } from './bases'

import { getBalance, getAllowance } from '../lib/methods'

export const refreshUserBaseBalance = writable(0);
export const refreshUserBaseAllowance = writable(0);

export const provider = writable(null);

export const chainId = writable(parseInt(localStorage.getItem('chainId')) || null);

export const signer = writable(null);

export const selectedAddress = derived([signer], async([$signer], set) => {
	if (!$signer) return set(null);
	const address = await $signer.getAddress();
	localStorage.setItem('address', address);
	set(address);
});

export const userBaseBalance = derived([selectedBaseId, selectedAddress, refreshUserBaseBalance], async ([$selectedBaseId, $selectedAddress, $refreshUserBaseBalance], set) => {
	if (!$selectedBaseId || !$selectedAddress) {
		set(0);
		return;
	}
	set(await getBalance($selectedBaseId, $selectedAddress));
}, 0);

export const userBaseAllowance = derived([selectedBaseId, selectedAddress, refreshUserBaseAllowance], async ([$selectedBaseId, $selectedAddress, $refreshUserBaseAllowance], set) => {
	if (!$selectedBaseId || !$selectedAddress) {
		set(0);
		return;
	}
	set(await getAllowance($selectedBaseId, $selectedAddress));
}, 0);