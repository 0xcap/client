import { get } from 'svelte/store'
import { LIQUIDATION_THRESHOLD } from './constants'
import { getProduct } from './methods'
import { contract } from '../stores/contracts'
import { positions } from '../stores/positions'
import { activeProducts } from '../stores/prices'
import { selectedProductId, products } from '../stores/products'
import { signer } from '../stores/wallet'

export function getContract(withSigner) {
  if (withSigner) return get(contract).connect(get(signer));
  return get(contract);
}

export function getContractAddress(name) {
  return get(contract).address;
}

export function selectProduct(productId, deactivate) {
	selectedProductId.set(productId);
	localStorage.setItem('selectedProductId', productId);
	activateProductPrices(productId);
	const productSymbol = get(products)[productId];
	if (productSymbol) location.hash = '/trade/' + productSymbol;

	if (deactivate) {
		// deactivate unused products = not selected one + not in positions
		let activeProducts = {};
		for (const p of get(positions)) {
			activeProducts[p.productId] = 1;
		}
		activeProducts[productId] = 1;
		let inactiveProductIds = {};
		for (const _productId in get(products)) {
			if (!activeProducts[_productId]) inactiveProductIds[_productId] = 1;
		}
		deactivateProductPrices(Object.keys(inactiveProductIds));
	}
}

export function activateProductPrices(productId) {
	if (get(activeProducts)[productId]) return;
	activeProducts.update((x) => {
		x[productId] = true;
		return x;
	});
}

export function deactivateProductPrices(productIds) {
	activeProducts.update((x) => {
		for (const productId of productIds) {
			if (productId == 1) continue; // don't deactivate ETH/USD
			delete x[productId];
		}
		return x;
	});
}

export async function calculateLiquidationPrice(params) {
	const { productId, price, leverage, isLong } = params;
	const productInfo = await getProduct(productId);
	let liquidationPrice;
	if (isLong) {
		liquidationPrice = price * (1 - LIQUIDATION_THRESHOLD / 10000 / leverage);
	} else {
		liquidationPrice = price * (1 + LIQUIDATION_THRESHOLD / 10000 / leverage);
	}
	return liquidationPrice;
}