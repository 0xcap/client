import { writable, derived } from 'svelte/store'

import { CHAIN_DATA } from '../lib/constants'
import { getBalance } from '../lib/methods'

export const refreshUserBaseBalance = writable(0);

export const provider = writable(null);

export const chainId = writable(parseInt(localStorage.getItem('chainId')) || null);

export const signer = writable(null);

export const selectedAddress = derived([signer], async([$signer], set) => {
	if (!$signer) return set(null);
	const address = await $signer.getAddress();
	localStorage.setItem('address', address);
	set(address);
});

export const userBaseBalance = derived([selectedAddress, refreshUserBaseBalance], async ([$selectedAddress, $refreshUserBaseBalance], set) => {
	if (!$selectedAddress) {
		set(0);
		return;
	}
	set(await getBalance($selectedAddress) * 1);
}, 0);

export const networkLabel = derived([chainId], ([$chainId]) => {
	return CHAIN_DATA[$chainId] && CHAIN_DATA[$chainId].label;
}, false);

export const isTestnet = derived([chainId], ([$chainId]) => {
	return CHAIN_DATA[$chainId] && CHAIN_DATA[$chainId].testnet;
}, false);

export const isUnderMaintenance = derived([chainId], ([$chainId]) => {
	return CHAIN_DATA[$chainId] && CHAIN_DATA[$chainId].underMaintenance;
}, false);

export const isUnsupported = derived([chainId, selectedAddress], ([$chainId, $selectedAddress]) => {
	return $selectedAddress && $chainId && !CHAIN_DATA[$chainId];
}, false);