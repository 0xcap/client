import { writable, derived } from 'svelte/store'
import { getProduct } from '../lib/methods'
import { getCachedLeverage } from '../lib/utils'
import { leverage } from './order'

export const products = writable({});

export const selectedProductId = writable(localStorage.getItem('selectedProductId') || 1);

export const selectedProduct = derived(selectedProductId, async ($selectedProductId, set) => {
	let product = await getProduct($selectedProductId);
	if (!product) return;
	leverage.set(getCachedLeverage($selectedProductId) || product.maxLeverage * 1 || 25);
	set(product);
}, {});

export const productList = derived(products, ($products) => {
	let list = [];
	for (const _productId in $products) {
		list.push({
			symbol: $products[_productId],
			id: _productId
		});
	}
	return list;
}, []);