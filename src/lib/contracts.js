import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { provider, signer, chainId } from '../stores/provider'
import { CONTRACTS, BASES, PRODUCTS } from './constants'

let bases = {};
let products = {};
let contractObjects = {};

export async function initContracts(chainId) {
	console.log('init contracts _chainId', chainId);

	for (const name in CONTRACTS[chainId]) {
		const obj = CONTRACTS[chainId][name];
		contractObjects[name] = new ethers.Contract(obj.address, obj.abi, get(provider));
	}

	for (const baseId in BASES[chainId]) {
		const obj = BASES[chainId][baseId];
		contractObjects[obj.symbol] = new ethers.Contract(obj.address, obj.abi, get(provider));
		delete obj.abi;
		bases[baseId] = obj;
	}

	products = PRODUCTS[chainId];

	console.log('contractObjects', contractObjects);

}

export function getBases() {
	return bases;
}

export function getBase(baseId) {
	return bases[baseId];
}

export function getProduct(productId) {
	return products[productId];
}

export function getContractAddress(name) {
	if (!name) name = 'TRADING';
	return contractObjects[name].address;
};

export function contract(name, withSigner) {
	if (!name) name = 'TRADING';
	if (withSigner) return contractObjects[name].connect(get(signer));
	return contractObjects[name];
};