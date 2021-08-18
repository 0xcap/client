import { writable, derived } from 'svelte/store'

import { signer, address } from './provider'
import { baseId } from './order'

import { getBaseInfo } from '../lib/contracts'
import { getUserStaked } from '../lib/methods'

export const refreshUserStaked = writable(0);

export const userStaked = derived([baseId, address, refreshUserStaked], async ([baseId, $address, $refreshUserStaked], set) => {
	if (!baseId || !$address) {
		set(0);
		return;
	}
	set(await getUserStaked(baseId, $address));
}, 0);