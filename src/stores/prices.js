import { writable, derived } from 'svelte/store'
import { getLatestPrice } from '../lib/methods'

export const refreshUserPositions = writable(0);

export const activeProducts = writable({});

let c, t;
export const prices = derived([activeProducts], async ([$activeProducts], set) => {
	clearInterval(c);
	clearTimeout(t);
	let _prices = {};
	const fetchPrices = async () => {
		// get prices for active products
		for (const productId in $activeProducts) {
			_prices[productId] = await getLatestPrice(productId);
		}
		set(_prices);
	}
	c = setInterval(fetchPrices, 5 * 1000);
	t = setTimeout(fetchPrices, 1 * 500); // to give time for all active products to be gathered, then fetched all at once
}, {});