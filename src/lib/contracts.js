import { ethers } from 'ethers'
import { bases } from '../stores/bases'
import { contracts, contractsReady } from '../stores/contracts'
import { products } from '../stores/products'
import { CHAIN_DATA, ERC20_ABI, DEFAULT_CHAIN_ID } from './constants'

export async function initContracts(chainId, _provider) {

	if (!CHAIN_DATA[chainId]) chainId = DEFAULT_CHAIN_ID;

	let contractObjects = {};

	// Trading contracts
	for (const name in CHAIN_DATA[chainId]['contracts']) {
		const obj = CHAIN_DATA[chainId]['contracts'][name];
		contractObjects[name] = new ethers.Contract(obj.address, obj.abi, _provider);
	}

	// Base contracts
	let _bases = {};
	for (const baseId in CHAIN_DATA[chainId]['bases']) {
		const obj = CHAIN_DATA[chainId]['bases'][baseId];
		contractObjects[obj.symbol] = new ethers.Contract(obj.address, ERC20_ABI, _provider);
		_bases[baseId] = obj;
	}
	bases.set(_bases);

	// Products for this chain
	let _products = {};
	for (const productId in CHAIN_DATA[chainId]['products']) {
		const symbol = CHAIN_DATA[chainId]['products'][productId];
		_products[productId] = symbol;
	}
	products.set(_products);

	// Set contracts
	contracts.set(contractObjects);
	contractsReady.set(true);

}