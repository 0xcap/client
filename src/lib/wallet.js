import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { signer, chainId, setNewChain } from '../stores/provider'
import { showToast } from '../stores/toasts'
import { initContracts } from './contracts'
import { initProvider } from './provider'
import { CHAIN_DATA } from './constants'

// Wallet (user connected, signer)
let walletProvider;

function handleChainSwitch(_chainId, _provider) {
	console.log('handleChainSwitch2', _chainId, get(chainId));
	if (!CHAIN_DATA[_chainId]) {
		if (get(signer)) {
			showToast('Network not supported.');
		}
		return false;
	}
	if (get(chainId) != _chainId) {
		setNewChain(_chainId);
	} else {
		chainId.set(_chainId);
		// init provider with connected chain id
		initProvider(_chainId, _provider);
	}
	return true;
}

export async function initWallet(_provider) {

	console.log('Init wallet');

	// Metamask is window.ethereum

	walletProvider = new ethers.providers.Web3Provider(_provider || window.ethereum);

	let listener = _provider ? _provider : window.ethereum;

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

export async function switchChain(_chainId) {

	const chainIdHex = '0x' + _chainId.toString(16);
	console.log('chainIdHex', chainIdHex, walletProvider);

	try {
	  await walletProvider.send('wallet_switchEthereumChain',[{ chainId: chainIdHex}]);
	} catch (error) {
		console.log('error', error);
	  // This error code indicates that the chain has not been added to MetaMask.
	  if (error.code === 4902) {
	    try {
	      await walletProvider.send('wallet_addEthereumChain',[{ 
	        	chainId: chainIdHex, 
	        	chainName: CHAIN_DATA[_chainId]['label'],
	        	rpcUrl: CHAIN_DATA[_chainId]['network']
	      }]);
	    } catch (addError) {
	      // handle "add" error
	    }
	  }
	  // handle other "switch" errors
	}


}