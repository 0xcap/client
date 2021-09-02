import { writable, derived, get } from 'svelte/store'

export const contract = writable(null);
export const contractReady = writable(false);