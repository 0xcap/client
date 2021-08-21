import { ethers } from 'ethers'
import { initContracts } from './contracts'
import { provider, chainId } from '../stores/provider'
import { DEFAULT_CHAIN_ID, CHAIN_DATA } from './constants'

// Read only provider from RPC

let providerChainId;

// Read only provider
export async function initProvider(_chainId, _provider) {
	// _provider is user wallet provider if available
	//console.log('initProvider', _chainId, providerChainId);
	if (!_chainId) {
		const localChainId = parseInt(localStorage.getItem('chainId'));
		if (localChainId) {
			_chainId = localChainId;
		} else {
			localStorage.setItem('chainId', DEFAULT_CHAIN_ID);
		}
	}
	console.log('h14', _chainId, providerChainId);
	if (_chainId == providerChainId || !CHAIN_DATA[_chainId]) return;
	providerChainId = _chainId;
	chainId.set(_chainId);
	const __provider = _provider || new ethers.providers.JsonRpcProvider(CHAIN_DATA[_chainId]['network'])
	initContracts(_chainId, __provider); // init contracts on this network
	provider.set(__provider);
	console.log('set provider');
}