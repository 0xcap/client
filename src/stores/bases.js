import { writable, derived } from 'svelte/store'
import { getBaseInfo } from '../lib/contracts'

export const baseId = writable(1);

export const baseInfo = derived(baseId, ($baseId) => {
	return getBaseInfo($baseId);
});