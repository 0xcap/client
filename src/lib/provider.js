import { ethers } from 'ethers'
import { initContracts } from './contracts'
import { provider, chainId } from '../stores/provider'
import { DEFAULT_CHAIN_ID, NETWORK_URLS } from './constants'

// Read only provider from RPC

let providerChainId;

// Read only provider
export async function initProvider(_chainId, _provider) {
	// _provider is user wallet provider if available
	//console.log('initProvider', _chainId, providerChainId);
	if (!_chainId) _chainId = DEFAULT_CHAIN_ID;
	if (_chainId == providerChainId || !NETWORK_URLS[_chainId]) return;
	providerChainId = _chainId;
	chainId.set(_chainId);
	provider.set(_provider || new ethers.providers.JsonRpcProvider(NETWORK_URLS[_chainId]));
	console.log('set provider');
	initContracts(_chainId); // init contracts on this network
}