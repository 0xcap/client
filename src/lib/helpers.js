import { get } from 'svelte/store'
import { contracts } from '../stores/contracts'
import { activeProducts } from '../stores/prices'
import { selectedProductId } from '../stores/products'

export function getContract(name, withSigner) {
  if (!name) name = 'TRADING';
  if (withSigner) return get(contracts)[name].connect(get(signer));
  return get(contracts)[name];
}

export function getContractAddress(name) {
  if (!name) name = 'TRADING';
  return get(contracts)[name].address;
}

export function setProductId(productId) {
	selectedProductId.set(productId);
	localStorage.setItem('selectedProductId', productId);
	activateProductPrices(productId);
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