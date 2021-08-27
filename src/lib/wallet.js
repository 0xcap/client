import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA } from './constants'

import { initContracts } from '../lib/contracts'

import { showToast } from '../stores/toasts'
import { clearTransactions } from '../stores/transactions'
import { provider, signer, chainId } from '../stores/wallet'

let walletProvider;

function handleChainSwitch(_chainId, _provider) {

	if (!CHAIN_DATA[_chainId] && get(signer)) return showToast('Network not supported.');

	if (get(chainId) != _chainId) {
		localStorage.setItem('chainId', _chainId);
		clearTransactions();
		window.location.reload();
	} else {
		chainId.set(_chainId);
		// init contracts with connected chain id
		//_provider = _provider || new ethers.providers.JsonRpcProvider(CHAIN_DATA[_chainId]['network'])
		initContracts(_chainId, _provider);
	}

}

export async function initWallet() {

	console.log('Init wallet');

	// Metamask is window.ethereum

	if (!window.ethereum) return showToast('Install Metamask to use Cap.');

	walletProvider = new ethers.providers.Web3Provider(window.ethereum);

	provider.set(walletProvider);

	let listener = window.ethereum;

	// Chain id (number)
	const network = await walletProvider.getNetwork();
	handleChainSwitch(network.chainId, walletProvider);
	listener.on('chainChanged', (_chainId) => {
		_chainId = parseInt(_chainId, 16);
		console.log('chain changed to', _chainId);
		handleChainSwitch(_chainId, walletProvider);
	});

	// Account
	handleAccountsChanged(await walletProvider.send('eth_accounts'));
	listener.on('accountsChanged', handleAccountsChanged);

	function handleAccountsChanged(accounts) {
		if (!accounts.length) {
			signer.set(null);
			return;
		}
		signer.set(walletProvider.getSigner());
	}

	listener.on('disconnect', (code, reason) => {
		// does not work for metamask
		console.log('disconnected', code, reason);
	});
	
}

export async function connectWallet(_type) {
	if (!window.ethereum) return showToast('Please install Metamask to connect.');
	try {
		if (_type == 'WalletConnect') {
			//await wcProvider.enable();
			//initWallet(wcProvider);
		} else {
			await walletProvider.send("eth_requestAccounts", []);
		}
		signer.set(walletProvider.getSigner());
	} catch(e) {
		console.error(e);
	}
}