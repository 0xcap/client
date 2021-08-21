import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBaseInfo, getProductSymbol, getProducts, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { addPendingTransaction } from '../stores/transactions'
import { baseId } from '../stores/bases'
import { productId, productInfo } from '../stores/order'
import { showToast } from '../stores/toasts'

import { activateProduct } from '../stores/prices'

import { PRICE_DECIMALS, LEVERAGE_DECIMALS, ERC20_ABI } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits, formatBaseAmount } from './utils'

let productInfoCache = {};

const formatPositions = function(positions, _baseId) {
	const base = getBaseInfo(_baseId);
	if (!base) return;
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			id: p.id.toNumber(),
			base: base.symbol,
			product: getProductSymbol(p.productId),
			timestamp: p.timestamp.toNumber(),
			isLong: p.isLong,
			isSettling: p.isSettling,
			margin: formatUnits(p.margin, base.decimals),
			leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
			amount: formatBaseAmount(formatUnits(p.margin, base.decimals) * formatUnits(p.leverage, LEVERAGE_DECIMALS), _baseId),
			price: formatUnits(p.price, PRICE_DECIMALS),
			liquidationPrice: formatUnits(p.liquidationPrice, PRICE_DECIMALS),
			productId: p.productId,
			baseId: _baseId
		});
		activateProduct(p.productId);
	}
	formattedPositions.reverse();
	return formattedPositions;
}

const formatProductInfo = function(p, _productId) {
	return {
		symbol: getProductSymbol(_productId),
		leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
		fee: formatUnits(p.fee, 2),
		interest: formatUnits(p.interest, 2),
		feed: p.feed,
		isActive: p.isActive
	}
}

// Bases

export async function listBases() {
	const obj = getBases();
	let list = [];
	for (const _baseId in obj) {
		list.push({
			symbol: obj[_baseId].symbol,
			address: obj[_baseId].address,
			decimals: obj[_baseId].decimals
		});
	}
	return list;
}

export function setBaseId(_baseId) {
	baseId.set(_baseId);
}

// Products

export function listProducts() {
	const obj = getProducts();
	let list = [];
	for (const _productId in obj) {
		list.push({
			symbol: obj[_productId],
			id: _productId
		});
	}
	return list;
}

export function setProductId(_productId) {
	productId.set(_productId);
	localStorage.setItem('productId', _productId);
	activateProduct(_productId);
}

export async function getProductInfo(_productId) {
	if (productInfoCache[_productId]) return productInfoCache[_productId];
	const pi = formatProductInfo(await contract().getProduct(_productId), _productId);
	productInfoCache[_productId] = pi;
	return pi;
}

// User

export async function getUserBaseBalance(_baseId, _address) {
	const base = getBaseInfo(_baseId);
	if (!base) return;
	const balance = await contract(base.symbol).balanceOf(_address);
	return formatUnits(balance, base.decimals);
}

export async function getUserBaseAllowance(_baseId, _address, contractName) {
	const base = getBaseInfo(_baseId);
	if (!base) return;
	const allowance = await contract(base.symbol).allowance(_address, getContractAddress(contractName));
	return formatUnits(allowance, base.decimals);
}

export async function approveUserBaseAllowance(_baseId, amount, contractName) {
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	const base = getBaseInfo(_baseId || get(baseId));
	if (!base) return;
	try {
		const tx = await contract(base.symbol, true).approve(getContractAddress(contractName), amount);
		addPendingTransaction({
			hash: tx.hash,
			description: `Approve ${base.symbol}`
		});
	} catch(e) {
		showToast(e);
	}
}

export async function getUserPositions(_baseId, _address) {
	const positions = await contract().getUserPositions(_address, _baseId);
	return formatPositions(positions, _baseId);
}

// Vault

export async function getUserStaked(_baseId, _address) {
	const base = getBaseInfo(_baseId);
	const staked = await contract().getUserStaked(_address, _baseId);
	return formatUnits(staked, base.decimals);
}

export async function getVaultCap(_baseId) {
	const base = getBaseInfo(_baseId);
	return formatUnits(await contract().getCap(_baseId), base.decimals);
}

export async function getVaultBalance(_baseId) {
	const base = getBaseInfo(_baseId);
	return formatUnits(await contract().getBalance(_baseId), base.decimals);
}

export async function getVaultTotalStaked(_baseId) {
	const base = getBaseInfo(_baseId);
	return formatUnits(await contract().getTotalStaked(_baseId), base.decimals);
}


export async function stake(_baseId, amount) {
	_baseId = _baseId || get(baseId);
	const base = getBaseInfo(_baseId);
	if (!base) return;
	try {
		const tx = await contract('', true).stake(_baseId, parseUnits(amount, base.decimals));
		addPendingTransaction({
			hash: tx.hash,
			description: `Stake ${amount} ${base.symbol}`
		});
	} catch(e) {
		showToast(e);
	}	
}

export async function unstake(_baseId, _stake) {
	_baseId = _baseId || get(baseId);
	const base = getBaseInfo(_baseId);
	if (!base) return;
	try {
		const tx = await contract('', true).unstake(_baseId, parseUnits(_stake, base.decimals));
		addPendingTransaction({
			hash: tx.hash,
			description: `Unstake ${_stake} ${base.symbol}`
		});
	} catch(e) {
		showToast(e);
	}
}

// Price

export async function getLatestPrice(_productId) {
	const p = await contract().getLatestPrice(_productId);
	return formatUnits(p, 8);
}

// Order

export async function submitOrder(_baseId, _productId, isLong, existingPositionId, margin, leverage, releaseMargin, isClose) {
	_baseId = _baseId || get(baseId);
	_productId = _productId || get(productId);
	const base = getBaseInfo(_baseId);
	if (!base) return;

	try {
		const tx = await contract('', true).submitOrder(_baseId, _productId, isLong, existingPositionId || 0, parseUnits(margin, base.decimals), parseUnits(leverage, LEVERAGE_DECIMALS), releaseMargin);
		let description;
		const _productInfo = await getProductInfo(_productId);
		if (isClose) {
			description = `Close position ${margin} ${base.symbol} on ${_productInfo.symbol}`;
		} else if (releaseMargin) {
			description = `Close position (RM) ${margin} ${base.symbol} on ${_productInfo.symbol}`;
		} else if (existingPositionId) {
			// add margin
			description = `Add margin ${margin} ${base.symbol} on ${_productInfo.symbol}`;
		} else {
			description = `New position ${margin}x${leverage} ${base.symbol} on ${_productInfo.symbol}`;
		}
		addPendingTransaction({
			hash: tx.hash,
			description
		});
	} catch(e) {
		showToast(e);
	}
}
