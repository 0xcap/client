import { get } from 'svelte/store'
import { getProduct } from './methods'
import { contracts } from '../stores/contracts'
import { activeProducts } from '../stores/prices'
import { selectedProductId, products } from '../stores/products'
import { signer } from '../stores/wallet'

export function getContract(name, withSigner) {
  if (!name) name = 'TRADING';
  if (withSigner) return get(contracts)[name].connect(get(signer));
  return get(contracts)[name];
}

export function getContractAddress(name) {
  if (!name) name = 'TRADING';
  return get(contracts)[name].address;
}

export function selectProduct(productId) {
	selectedProductId.set(productId);
	localStorage.setItem('selectedProductId', productId);
	activateProductPrices(productId);
	location.hash = '/trade/' + get(products)[productId];
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