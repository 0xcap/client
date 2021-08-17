import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { provider, signer, chainId } from '../stores/provider'
import { CONTRACTS } from './constants'

let bases = {};
let basesA = {}; // address => info
let contractObjects = {};

export async function initContracts(chainId) {
	console.log('init contracts _chainId', chainId);

	for (const name in CONTRACTS[chainId]) {
		const obj = CONTRACTS[chainId][name];
		contractObjects[name] = new ethers.Contract(obj.address, obj.abi, get(provider));
		if (obj.decimals) {
			// it's a base
			delete obj.abi;
			bases[name] = obj;
			obj.symbol = name;
			basesA[obj.address] = obj;
		}
	}

	console.log('contractObjects', contractObjects);

}

export function getBases() {
	return bases;
}
export function getBase(base) {
	return bases[base];
}
export function getBaseA(address) {
	return basesA[address];
}

export function getContractAddress(name) {
	if (!name) name = 'TRADING';
	return CONTRACTS[get(chainId)][name].address;
};

export function contract(name, withSigner) {
	if (!name) name = 'TRADING';
	if (withSigner) return contractObjects[name].connect(get(signer));
	return contractObjects[name];
};