import { get } from 'svelte/store'

import { PRICE_DECIMALS, BASE_SYMBOL, ADDRESS_ZERO } from './constants'
import { handleTransactionEvent } from './events'
import { getContract, getContractAddress } from './helpers'
import { formatUnits, parseUnits, formatProduct, formatPositions, formatToDisplay } from './utils'

import { hideModal } from '../stores/modals'
import { showToast } from '../stores/toasts'
import { addPendingTransaction } from '../stores/transactions'
import { provider, isUnsupported } from '../stores/wallet'

let productCache = {};

export async function getBalance(address) {
	return formatUnits(await get(provider).getBalance(address), 18);
}

export async function getProduct(productId) {
	if (productCache[productId]) return productCache[productId];
	const product = formatProduct(await getContract().getProduct(productId), productId);
	productCache[productId] = product;
	return product;
}

// TX completion handler
async function checkTx(hash, event, isFullClose, positionId) {
	let i = 0;
	let c = setInterval(async () => {
		//console.log('check');
		i++;
		if (i > 30) return clearInterval(c);
		const txReceipt = await get(provider).getTransactionReceipt(hash);
		//console.log('txReceipt', txReceipt)
	    if (txReceipt && txReceipt.blockNumber) {
	    	//console.log('done ', Date.now(), txReceipt);
	    	handleTransactionEvent({
	    		event,
	    		txReceipt,
	    		transactionHash: txReceipt.transactionHash,
	    		args: {
	    			isFullClose,
	    			positionId
	    		}
	    	});
	    	clearInterval(c);
	    }
	}, 500);
}

export async function getChainlinkPrice(productId) {
	return formatUnits(await getContract().getChainlinkPrice(productId), PRICE_DECIMALS);
}

export async function getPositions(positionIds) {
	console.log('getPositions', positionIds);
	if (!positionIds.length) return;
	return formatPositions(await getContract().getPositions(positionIds), positionIds);
}

export async function submitNewPosition(productId, isLong, leverage, margin) {
	if (get(isUnsupported)) return;
	const product = await getProduct(productId);
	const amount = margin * leverage;
	try {
		const tx = await getContract(true).submitNewPosition(productId, isLong, parseUnits(leverage), {value: parseUnits(margin, 18)});
		addPendingTransaction({
			hash: tx.hash,
			description: `New position ${formatToDisplay(amount)} ${BASE_SYMBOL} on ${product.symbol}`
		});
		checkTx(tx.hash, 'OpenOrder');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function cancelPosition(positionId) {
	try {
		const tx = await getContract(true).cancelPosition(positionId);
		addPendingTransaction({
			hash: tx.hash,
			description: `Cancel open order`
		});
		checkTx(tx.hash, 'CancelPosition');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function addMargin(positionId, margin, productId) {
	const product = await getProduct(productId);
	try {
		const tx = await getContract(true).addMargin(positionId, {value: parseUnits(margin, 18)});
		addPendingTransaction({
			hash: tx.hash,
			description: `Add margin ${formatToDisplay(margin)} ${BASE_SYMBOL} on ${product.symbol}`
		});
		checkTx(tx.hash, 'AddMargin');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function closePosition(positionId, margin, amount, productId, isFullClose) {
	const product = await getProduct(productId);
	try {
		const tx = await getContract(true).submitCloseOrder(positionId, parseUnits(margin));
		addPendingTransaction({
			hash: tx.hash,
			description: `Close position ${formatToDisplay(amount)} ${BASE_SYMBOL} on ${product.symbol}`
		});
		checkTx(tx.hash, 'CloseOrder', isFullClose, positionId);
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function cancelOrder(orderId) {
	try {
		const tx = await getContract(true).cancelOrder(orderId);
		addPendingTransaction({
			hash: tx.hash,
			description: `Cancel close order`
		});
		checkTx(tx.hash, 'CancelOrder');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}