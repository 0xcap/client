import { get } from 'svelte/store'
import { getProduct } from './methods'
import { contract } from '../stores/contracts'
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

export function selectProduct(productId) {
	selectedProductId.set(productId);
	localStorage.setItem('selectedProductId', productId);
	activateProductPrices(productId);
	const productSymbol = get(products)[productId];
	if (productSymbol) location.hash = '/trade/' + productSymbol;
}

export function activateProductPrices(productId) {
	activeProducts.update((x) => {
		x[productId] = true;
		return x;
	});
}

export function deactivateProductPrices(productId) {
	activeProducts.update((x) => {
		delete x[productId];
		return x;
	});
}

export async function calculateLiquidationPrice(params) {
	const { productId, price, leverage, isLong } = params;
	const productInfo = await getProduct(productId);
	const liquidationThreshold = productInfo.liquidationThreshold * 1 || 80;
	let liquidationPrice;
	if (isLong) {
		liquidationPrice = price * (1 - liquidationThreshold / 100 / leverage);
	} else {
		liquidationPrice = price * (1 + liquidationThreshold/100 / leverage);
	}
	return liquidationPrice;
}