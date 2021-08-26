import { writable, derived } from 'svelte/store'

import { leverage, getCachedLeverage } from './order'
import { getProductInfo } from '../lib/methods'

export const productId = writable(localStorage.getItem('productId') || 2);

export const productInfo = derived(productId, async ($productId, set) => {
	const pi = await getProductInfo($productId);
	if (!pi) return;

	leverage.set(getCachedLeverage($productId) || pi.leverage * 1);
	set(pi);
}, {});
