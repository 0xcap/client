import { get } from 'svelte/store'
import { LIQUIDATION_THRESHOLD } from './constants'
import { getProduct } from './methods'
import { contract } from '../stores/contracts'
import { selectedProductId } from '../stores/products'
import { signer } from '../stores/wallet'

export function getContract(withSigner) {
  if (withSigner) return get(contract).connect(get(signer));
  return get(contract);
}

export function selectProduct(productId, deactivate) {
	selectedProductId.set(productId);
	localStorage.setItem('selectedProductId', productId);
}

export function calculateLiquidationPrice(params) {
	const { productId, price, leverage, isLong } = params;
	let liquidationPrice;
	if (isLong) {
		liquidationPrice = price * (1 - LIQUIDATION_THRESHOLD / 10000 / leverage);
	} else {
		liquidationPrice = price * (1 + LIQUIDATION_THRESHOLD / 10000 / leverage);
	}
	return liquidationPrice;
}

export async function getUPL(position, latestPrice) {
	let upl = 0;
	if (position.price * 1 == 0) return undefined;
	if (latestPrice) {
		const productInfo = await getProduct(position.productId);
		if (position.isLong) {
			upl = position.margin * position.leverage * (latestPrice * 1 - position.price * 1) / position.price;
		} else {
			upl = position.margin * position.leverage * (position.price * 1 - latestPrice * 1) / position.price;
		}
		// Add interest
		let interest;
		let now = parseInt(Date.now() / 1000);
		if (position.isSettling || now < position.timestamp * 1 + 1800) {
			interest = 0;
		} else {
			interest = position.margin * position.leverage * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
		}
		if (interest < 0) interest = 0;
		upl -= interest;
	}
	return upl;
}

export async function getInterest(position) {
		// Add interest
		let interest;
		let now = parseInt(Date.now() / 1000);
		const productInfo = await getProduct(position.productId);
		if (position.isSettling || now < position.timestamp * 1 + 1800) {
			interest = 0;
		} else {
			interest = position.margin * position.leverage * ((productInfo.interest * 1 || 0) / 100) * (now - position.timestamp * 1) / (360 * 24 * 3600);
		}
		if (interest < 0) interest = 0;
		return -1 * interest;
}