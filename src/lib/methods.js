import { get } from 'svelte/store'

import { LEVERAGE_DECIMALS, PRICE_DECIMALS } from './constants'
import { getContract, getContractAddress } from './helpers'
import { formatUnits, parseUnits, formatProduct, formatVault, formatPositions, formatToDisplay } from './utils'

import { bases, selectedBaseId } from '../stores/bases'
import { hideModal } from '../stores/modals'
import { showToast } from '../stores/toasts'
import { addPendingTransaction } from '../stores/transactions'

// Products

let productCache = {};
export async function getProduct(productId) {
	if (productCache[productId]) return productCache[productId];
	const product = formatProduct(await getContract().getProduct(productId), productId);
	productCache[productId] = product;
	return product;
}

// Base

export async function getBalance(baseId, address) {
	const base = get(bases)[baseId || get(selectedBaseId)];
	const balance = await getContract(base.symbol).balanceOf(address);
	return formatUnits(balance, base.decimals);
}

export async function getAllowance(baseId, address) {
	const base = get(bases)[baseId || get(selectedBaseId)];
	const allowance = await getContract(base.symbol).allowance(address, getContractAddress());
	return formatUnits(allowance, base.decimals);
}

export async function approveAllowance(baseId, amount) {
	const base = get(bases)[baseId || get(selectedBaseId)];
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	try {
		const tx = await getContract(base.symbol, true).approve(getContractAddress(), amount);
		addPendingTransaction({
			hash: tx.hash,
			description: `Approve ${base.symbol}`
		});
	} catch(e) {
		showToast(e);
		return e;
	}
}

// Faucet
export async function requestFaucet(baseId, address) {
	if (!address) return;
	const base = get(bases)[baseId || get(selectedBaseId)];
	try {
		const tx = await getContract(base.symbol, true).mint(address, 100000 * 10**6);
		addPendingTransaction({
			hash: tx.hash,
			description: `Faucet request for 100000 ${base.symbol}`
		});
	} catch(e) {
		showToast(e);
		return e;
	}
}


// Vault

export async function getVault(baseId) {
	return formatVault(await getContract().getVault(baseId), baseId);
}

export async function getUserStaked(baseId, address) {
	const base = get(bases)[baseId];
	const staked = await getContract().getUserStaked(address, baseId);
	return formatUnits(staked, base.decimals);
}

export async function stake(baseId, amount) {
	baseId = baseId || get(selectedBaseId);
	const base = get(bases)[baseId];
	try {
		const tx = await getContract(null, true).stake(baseId, parseUnits(amount, base.decimals));
		addPendingTransaction({
			hash: tx.hash,
			description: `Stake ${amount} ${base.symbol}`
		});
		showToast('Stake submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

export async function redeem(baseId, amount) {
	baseId = baseId || get(selectedBaseId);
	const base = get(bases)[baseId];
	try {
		const tx = await getContract(null, true).redeem(baseId, parseUnits(amount, base.decimals));
		addPendingTransaction({
			hash: tx.hash,
			description: `Redeem ${amount} ${base.symbol}`
		});
		showToast('Redemption submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}
}

// Price

export async function getLatestPrice(productId) {
	return formatUnits(await getContract().getLatestPrice(productId), PRICE_DECIMALS);
}

// Positions

export async function getUserPositions(baseId, address) {
	return formatPositions(await getContract().getUserPositions(address, baseId), baseId);
}

export async function submitOrder(baseId, productId, isLong, margin, leverage, positionId, releaseMargin, isClose) {
	
	baseId = baseId || get(selectedBaseId);
	const base = get(bases)[baseId];
	const marginUnits = parseInt(margin * 10**(base.decimals));
	const leverageUnits = parseUnits(leverage, LEVERAGE_DECIMALS);
	const amount = margin * leverage;

	try {

		const tx = await getContract(null, true).submitOrder(baseId, productId, isLong, marginUnits, leverageUnits, positionId || 0, releaseMargin || false);

		let description;
		const product = await getProduct(productId);

		if (isClose) {
			description = `Close position ${formatToDisplay(amount)} ${base.symbol} on ${product.symbol}`;
		} else if (releaseMargin) {
			description = `Close position (RM) ${formatToDisplay(amount)} ${base.symbol} on ${product.symbol}`;
		} else if (positionId) {
			// add margin
			description = `Add margin ${formatToDisplay(margin)} ${base.symbol} on ${product.symbol}`;
		} else {
			description = `New position ${formatToDisplay(amount)} ${base.symbol} on ${product.symbol}`;
		}
		addPendingTransaction({
			hash: tx.hash,
			description
		});
		showToast('Order submitted.', 'info');
		hideModal();
	} catch(e) {
		showToast(e);
		return e;
	}

}
