import { ethers } from 'ethers'
import { PRICE_PRECISION } from './constants'
import { get } from 'svelte/store'
import { productId } from '../stores/order'

export function toBytes32(string) {
  return ethers.utils.formatBytes32String(string);
}
export function fromBytes32(string) {
  return ethers.utils.parseBytes32String(string);
}
export function formatUnits(number, units) {
  if (!units) units = 6; // usdc
  return ethers.utils.formatUnits(number, units);
}
export function parseUnits(number, units) {
  if (!units) units = 6; // usdc
  if (typeof(number) == 'number') number = number.toString();
  return ethers.utils.parseUnits(number, units);
}

export function formatPrice(price, _productId) {
  if (!_productId) _productId = get(productId);
  if (!price || !_productId) return 0;
  return (price * 1).toFixed(PRICE_PRECISION[_productId] || 2);
}