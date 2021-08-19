import { writable, derived, get } from 'svelte/store'
import { provider } from './provider'

export const hasPending = writable(false);
export const transactions = writable(JSON.parse(localStorage.getItem('transactions') || '[]'));

// Local test
//export const transactions = writable([{"state":"pending","description":"pending test tx","hash":"0x9cbf556579e8e64933ae8d44b3aa7fef90d0e8bdfb78c7e63ca3d99ab4cc5ed6"}]);

export function addPendingTransaction(tx) {
	transactions.update((x) => {
		tx.state = 'pending';
		x.unshift(tx);
		let localTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
		localTxs.unshift(tx);
		localStorage.setItem('transactions', JSON.stringify(localTxs));
		return x;
	});
	hasPending.set(true);
}

export function completeTransaction(txHash) {
	transactions.update((x) => {
		let new_transactions = [];
		let has_pending = false;
		for (const tx of x) {
			if (tx.hash.toLowerCase() == txHash.toLowerCase()) {
				tx.state = 'complete';
			}
			if (tx.state == 'pending') {
				has_pending = true;
			}
			new_transactions.push(tx);
		}
		localStorage.setItem('transactions', JSON.stringify(new_transactions));
		if (has_pending) {
			hasPending.set(true);
		} else {
			hasPending.set(false);
		}
		return new_transactions;
	});
}

export function clearTransactions() {
	transactions.set([]);
	localStorage.removeItem('transactions');
	hasPending.set(false);
}

export async function checkPendingTransactions() {
	// checks pending txs for completion, if there is still pending, set hasPending to true. This runs on page load once. This can show a loading indicator somewhere
	const _provider = get(provider);
	if (!_provider) return;
	const _transactions = get(transactions);

	let new_transactions = [];
	let has_pending = false;
	for (const tx of _transactions) {
		if (tx.state == 'pending') {
			try {
				// Get tx receipt
				const receipt = await _provider.getTransactionReceipt(tx.hash);
				//console.log('got receipt', receipt);
			    if (receipt && receipt.blockNumber) {
			    	// Transaction mined, set state to complete
			    	tx.state = 'complete';
			    } else {
			    	has_pending = true;
			    }
			} catch(e) {
				has_pending = true;
				console.error(e);
			}
		}
		new_transactions.push(tx);
	}
	//console.log('new_transactions', new_transactions);
	localStorage.setItem('transactions', JSON.stringify(new_transactions));
	if (has_pending) hasPending.set(true);
	transactions.set(new_transactions);
}