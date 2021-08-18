import { writable, derived } from 'svelte/store'

export const transactions = writable(JSON.parse(localStorage.getItem('transactions') || '[]'));

export function addPendingTransaction(tx) {
	transactions.update((x) => {
		tx.state = 'pending';
		x.unshift(tx);
		let localTxs = JSON.parse(localStorage.getItem('transactions') || '[]');
		localTxs.unshift(tx);
		localStorage.setItem('transactions', JSON.stringify(localTxs));
		return x;
	});
}

export function completeTransaction(txHash) {
	transactions.update((x) => {
		let new_transactions = [];
		for (const tx of x) {
			if (tx.hash.toLowerCase() == txHash.toLowerCase()) {
				tx.state = 'complete';
			}
			new_transactions.push(tx);
		}
		localStorage.setItem('transactions', JSON.stringify(new_transactions));
		return new_transactions;
	});
}

export function clearPendingTransactions() {
	transactions.set([]);
	localStorage.removeItem('transactions');
}