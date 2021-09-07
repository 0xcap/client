import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA, DEFAULT_CHAIN_ID } from './constants'
import { initContracts } from './contracts'

import { showToast } from '../stores/toasts'
import { clearTransactions } from '../stores/transactions'
import { provider, signer, selectedAddress, chainId } from '../stores/wallet'

let walletProvider;

function handleChainSwitch(_chainId, _provider) {

	if (!CHAIN_DATA[_chainId]) {
		if (get(signer)) showToast('Network not supported.');
	}

	if (get(chainId) != _chainId) {
		localStorage.setItem('chainId', _chainId);
		clearTransactions();
		window.location.reload();
	} else {
		chainId.set(_chainId);
		initContracts(_chainId, _provider);
	}

}

function handleAccountsChanged(accounts) {
	if (!accounts.length) return signer.set(null);
	if (get(selectedAddress) && get(selectedAddress) != accounts[0]) {
		clearTransactions();
	}
	signer.set(walletProvider.getSigner());
}

export async function initWallet() {

	// Window.ethereum is Metamask
	let listener = window.ethereum;

	if (!listener) {
		showToast('Install Metamask to use Cap.');
		handleChainSwitch(DEFAULT_CHAIN_ID, null);
	} else {

		walletProvider = new ethers.providers.Web3Provider(listener);

		// Chain id (number)
		const network = await walletProvider.getNetwork();
		handleChainSwitch(network.chainId, walletProvider);
		listener.on('chainChanged', (_chainId) => handleChainSwitch(parseInt(_chainId, 16), walletProvider));

		// Account
		handleAccountsChanged(await walletProvider.send('eth_accounts'));
		listener.on('accountsChanged', handleAccountsChanged);

	}

	provider.set(walletProvider);
	
}

export async function connectWallet() {
	if (!window.ethereum) return showToast('Please install Metamask to connect.');
	try {
		await walletProvider.send("eth_requestAccounts", []);
		signer.set(walletProvider.getSigner());
		const network = await walletProvider.getNetwork();
		if (!CHAIN_DATA[network.chainId]) showToast('Network not supported.');
	} catch(e) {
		console.error(e);
	}
}