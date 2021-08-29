import { writable, derived } from 'svelte/store'

export const bases = writable({});

export const selectedBaseId = writable(1);

export const selectedBase = derived([bases, selectedBaseId], ([$bases, $selectedBaseId]) => {
	return $bases && $bases[$selectedBaseId];
});