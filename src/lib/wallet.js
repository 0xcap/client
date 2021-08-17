import { ethers } from 'ethers';
import { signer, chainId } from '../stores/provider'
import { showToast } from '../stores/toasts'
import { initContracts } from './contracts'
import { initProvider } from './provider'
import { NETWORK_URLS } from './constants'

// Wallet (user connected, signer)

let walletProvider;

function handleChainSwitch(_chainId, _provider) {
	if (!NETWORK_URLS[_chainId]) {
		showToast('Network not supported.');
		return false;
	}
	chainId.set(_chainId);
	// init provider with connected chain id
	initProvider(_chainId, _provider);
	return true;
}

export async function initWallet() {

	console.log('Init wallet');

	// Metamask

	if (!window.ethereum) return showToast('Metamask not installed.');

	walletProvider = new ethers.providers.Web3Provider(window.ethereum);

	// Chain id (number)
	const network = await walletProvider.getNetwork();
	handleChainSwitch(network.chainId, walletProvider);
	ethereum.on('chainChanged', (_chainId) => {
		_chainId = parseInt(_chainId, 16);
		console.log('chain changed to', _chainId);
		handleChainSwitch(_chainId, walletProvider);
	});

	// Account
	handleAccountsChanged(await walletProvider.send('eth_accounts'));
	ethereum.on('accountsChanged', handleAccountsChanged);

	function handleAccountsChanged(accounts) {
		if (!accounts.length) {
			signer.set(null);
			return showToast('Please connect to MetaMask.');
		}
		signer.set(walletProvider.getSigner());
	}
	
}

export async function connectWallet() {
	try {
		await walletProvider.send("eth_requestAccounts", []);
		signer.set(walletProvider.getSigner());
	} catch(e) {
		console.error(e);
	}
}