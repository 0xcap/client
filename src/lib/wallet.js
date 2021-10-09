import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA, DEFAULT_CHAIN_ID } from './constants'
import { initContracts } from './contracts'

import { hideModal } from '../stores/modals'
import { showToast } from '../stores/toasts'
import { clearTransactions } from '../stores/transactions'
import { provider, signer, selectedAddress, chainId } from '../stores/wallet'

let walletProvider;
let walletconnect;

function handleChainSwitch(_chainId) {

	if (!CHAIN_DATA[_chainId]) {
		return showToast('Network not supported. Switch to Arbitrum to trade.');
	}

	if (get(chainId) != _chainId) {
		localStorage.setItem('chainId', _chainId);
	}

	chainId.set(_chainId);
	initContracts(_chainId, walletProvider);

}

function handleAccountsChanged() {
	signer.set(walletProvider.getSigner());
}

export async function initMetamaskSession() {

	let metamask = window.ethereum;

	if (metamask) {

		walletProvider = new ethers.providers.Web3Provider(metamask);

		// Chain id (number)
		const network = await walletProvider.getNetwork();
		handleChainSwitch(network.chainId, walletProvider);
		metamask.on('chainChanged', (_chainId) => handleChainSwitch(parseInt(_chainId, 16)));

		// Account
		handleAccountsChanged(await walletProvider.send('eth_accounts'));
		metamask.on('accountsChanged', handleAccountsChanged);

		provider.set(walletProvider);

	} else {
		initContracts();
	}
	
}

export async function connectWallet(type) {
	
	if (type == 'metamask') {

		let metamask = window.ethereum;
		if (!metamask) return showToast('Metamask is not installed.');
		
		walletProvider = new ethers.providers.Web3Provider(metamask);
		provider.set(walletProvider);

		await walletProvider.send("eth_requestAccounts", []);

		hideModal();
		
		const network = await walletProvider.getNetwork();
		handleChainSwitch(network.chainId);
		metamask.on('chainChanged', (_chainId) => handleChainSwitch(parseInt(_chainId, 16)));

		handleAccountsChanged();
		metamask.on('accountsChanged', handleAccountsChanged);

	}

	if (type == 'walletconnect') {

		let myScript = document.createElement("script");
		myScript.setAttribute("src", "https://unpkg.com/@walletconnect/web3-provider@1.6.6/dist/umd/index.min.js");
		document.body.appendChild(myScript);

		myScript.addEventListener("load", scriptLoaded, false);

		async function scriptLoaded() {

			walletconnect = new WalletConnectProvider.default({
				rpc: {
					42161: 'https://arb1.arbitrum.io/rpc'
				}
			});

			await walletconnect.enable();

			hideModal();

			walletProvider = new ethers.providers.Web3Provider(walletconnect);

			provider.set(walletProvider);

			const network = await walletProvider.getNetwork();
			handleChainSwitch(network.chainId);

			handleAccountsChanged();

			// Subscribe to accounts change
			walletconnect.on("accountsChanged", (accounts) => {
			  console.log(accounts);
			  handleAccountsChanged();
			});

			// Subscribe to chainId change
			walletconnect.on("chainChanged", (chainId) => {
			  console.log(chainId);
			  handleChainSwitch(chainId);
			});

			// Subscribe to session disconnection
			walletconnect.on("disconnect", (code, reason) => {
			  console.log('disconnect', code, reason);
			  window.location.reload();
			});

		}

	}

}

export async function disconnectWallet(force) {
	if (force && walletconnect) await walletconnect.disconnect();
	signer.set(null);
}