import { ethers } from 'ethers'
import { contract, contractReady } from '../stores/contracts'
import { products } from '../stores/products'
import { CHAIN_DATA, DEFAULT_CHAIN_ID } from './constants'

export async function initContracts(chainId, _provider) {

	if (!CHAIN_DATA[chainId]) chainId = DEFAULT_CHAIN_ID;

	// Products for this chain
	let _products = {};
	for (const productId in CHAIN_DATA[chainId].products) {
		const symbol = CHAIN_DATA[chainId]['products'][productId];
		_products[productId] = symbol;
	}
	products.set(_products);

	// Set contracts
	const _contract = CHAIN_DATA[chainId].contract;
	contract.set(new ethers.Contract(_contract.address, _contract.abi, _provider));
	contractReady.set(true);

}