import { get } from 'svelte/store'

import { PRICE_DECIMALS, BASE_SYMBOL, ADDRESS_ZERO } from './constants'
import { getContract, getContractAddress } from './helpers'
import { formatUnits, parseUnits, formatProduct, formatVault, formatPositions, formatStakes, formatToDisplay } from './utils'

import { hideModal } from '../stores/modals'
import { showToast } from '../stores/toasts'
import { addPendingTransaction } from '../stores/transactions'
import { provider } from '../stores/wallet'

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

export async function getVault() {
	return formatVault(await getContract().getVault());
}

export async function getStake(stakeId) {
	return formatStake(await getContract().getStake(stakeId));
}
export async function getUserStaked(stakeId) {
}

export async function stake(amount) {
	try {
		const tx = await getContract(true).stake({value: parseUnits(amount, 18)});
		addPendingTransaction({
			hash: tx.hash,
			description: `Stake ${amount} ${BASE_SYMBOL}`
		});
		showToast('Stake submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function redeem(stakeId, amount) {
	try {
		const tx = await getContract(true).redeem(stakeId, parseUnits(amount));
		addPendingTransaction({
			hash: tx.hash,
			description: `Redeem ${amount} ${BASE_SYMBOL}`
		});
		showToast('Redemption submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function getLatestPrice(productId) {
	return formatUnits(await getContract().getLatestPrice(ADDRESS_ZERO, productId), PRICE_DECIMALS);
}

export async function getPositions(positionIds) {
	return formatPositions(await getContract().getPositions(positionIds), positionIds);
}

export async function getStakes(stakeIds) {
	return formatStakes(await getContract().getStakes(stakeIds), stakeIds);
}

export async function openPosition(productId, isLong, leverage, margin) {
	const product = await getProduct(productId);
	const amount = margin * leverage;
	try {
		const tx = await getContract(true).openPosition(productId, isLong, parseUnits(leverage), {value: parseUnits(margin, 18)});
		addPendingTransaction({
			hash: tx.hash,
			description: `New position ${formatToDisplay(amount)} ${BASE_SYMBOL} on ${product.symbol}`
		});
		showToast('Order to open position submitted.', 'info');
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
		showToast('Order to add margin submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function closePosition(positionId, margin, releaseMargin, productId) {
	const product = await getProduct(productId);
	try {
		const tx = await getContract(true).closePosition(positionId, parseUnits(margin), releaseMargin || false);
		addPendingTransaction({
			hash: tx.hash,
			description: `Close position ${formatToDisplay(margin)} ${BASE_SYMBOL} on ${product.symbol}`
		});
		showToast('Order to close position submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}