import { ethers } from 'ethers'
import { PRICE_PRECISION } from './constants'
import { get } from 'svelte/store'
import { baseId } from '../stores/bases'
import { productId } from '../stores/order'
import { getBaseInfo } from './contracts'

export function toBytes32(string) {
  return ethers.utils.formatBytes32String(string);
}
export function fromBytes32(string) {
  return ethers.utils.parseBytes32String(string);
}
export function formatUnits(number, units) {
  if (!units) units = 6; // usdc
  return ethers.utils.formatUnits(number || 0, units);
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

export function formatBaseAmount(amount, _baseId) {
  if (!_baseId) _baseId = get(baseId);
  if (!amount || !_baseId) return 0;
  const base = getBaseInfo(_baseId);
  if (amount * 1 >= 1000) return Math.round(amount*1).toLocaleString();
  return (amount * 1).toFixed(base.precision || 2);
}

export function shortAddr(_address) {
  if (!_address) return;
  return _address.substring(0,6) + '...' + _address.slice(-4);
}