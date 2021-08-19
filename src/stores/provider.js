import { writable, derived } from 'svelte/store'
import { clearTransactions } from '../stores/transactions'

export const provider = writable(null);
export const chainId = writable(parseInt(localStorage.getItem('chainId')) || null);

export const signer = writable(null);

export const address = derived([signer], async([$signer], set) => {
	if (!$signer) return set(null);
	const _address = await $signer.getAddress();
	localStorage.setItem('address', _address);
	set(_address);
});

export function setNewChain(_chainId) {
	localStorage.setItem('chainId', _chainId);
	clearTransactions();
	console.log('setNewChain', _chainId);
	window.location.reload();
}