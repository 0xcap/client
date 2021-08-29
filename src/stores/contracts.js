import { writable, derived, get } from 'svelte/store'

export const contracts = writable({});
export const contractsReady = writable(false);