import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { provider, signer, chainId } from '../stores/provider'
import { CHAIN_DATA, ERC20_ABI } from './constants'

let bases = {};
let products = {};
let contractObjects = {};

export async function initContracts(chainId, _provider) {
	console.log('init contracts _chainId', chainId);

	if (!_provider) _provider = get(provider);

	for (const name in CHAIN_DATA[chainId]['contracts']) {
		const obj = CHAIN_DATA[chainId]['contracts'][name];
		contractObjects[name] = new ethers.Contract(obj.address, obj.abi, _provider);
	}

	// Base contracts
	for (const baseId in CHAIN_DATA[chainId]['bases']) {
		const obj = CHAIN_DATA[chainId]['bases'][baseId];
		contractObjects[obj.symbol] = new ethers.Contract(obj.address, ERC20_ABI, _provider);
		bases[baseId] = obj;
	}

	// Products for this chain
	for (const productId in CHAIN_DATA[chainId]['products']) {
		const symbol = CHAIN_DATA[chainId]['products'][productId];
		products[productId] = symbol;
	}

	console.log('contractObjects', contractObjects);
}

export function getBaseInfo(baseId) {
	return bases[baseId];
}

export function getBases() {
	return bases;
}

export function getProductSymbol(productId) {
	return products[productId];
}

export function getProducts() {
	return products;
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