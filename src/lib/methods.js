import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBaseInfo, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { addPendingTransaction } from '../stores/transactions'
import { baseId, productId, productInfo } from '../stores/order'


import { CONTRACTS, BASES, PRODUCTS, PRICE_DECIMALS, LEVERAGE_DECIMALS, ERC20_ABI } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const formatPositions = function(positions, _baseId) {
	const base = getBaseInfo(_baseId);
	if (!base) return;
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			id: p.id.toNumber(),
			base: base.symbol,
			product: PRODUCTS[p.productId],
			timestamp: p.timestamp.toNumber(),
			isLong: p.isLong,
			isSettling: p.isSettling,
			margin: formatUnits(p.margin, base.decimals),
			leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
			price: formatUnits(p.price, PRICE_DECIMALS),
			liquidationPrice: formatUnits(p.liquidationPrice, PRICE_DECIMALS),
		});
	}
	return formattedPositions;
}

const formatProductInfo = function(p, _productId) {
	return {
		symbol: PRODUCTS[_productId],
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

export function setProductId(_productId) {
	productId.set(_productId);
}

export async function getProductInfo(_productId) {
	return formatProductInfo(await contract().getProduct(_productId), _productId);
}

// User

export async function getUserBaseBalance(_baseId, _address) {
	const base = getBaseInfo(_baseId);
	const balance = await contract(base.symbol).balanceOf(_address);
	return formatUnits(balance, base.decimals);
}

export async function getUserBaseAllowance(_baseId, _address, contractName) {
	const base = getBaseInfo(_baseId);
	const allowance = await contract(base.symbol).allowance(_address, getContractAddress(contractName));
	return formatUnits(allowance, base.decimals);
}

export async function approveUserBaseAllowance(_baseId, amount, contractName) {
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	const base = getBaseInfo(_baseId || get(baseId));
	if (!base) return;
	const tx = await contract(base.symbol, true).approve(getContractAddress(contractName), amount);
	addPendingTransaction({
		hash: tx.hash,
		description: `Approve ${base.symbol}`
	});
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

export async function stake(_baseId, amount) {
	_baseId = _baseId || get(baseId);
	const base = getBaseInfo(_baseId);
	if (!base) return;
	const tx = await contract('', true).stake(_baseId, parseUnits(amount, base.decimals));
	addPendingTransaction({
		hash: tx.hash,
		description: `Stake ${amount} ${base.symbol}`
	});
}


export async function getLatestPrice(productId) {
	console.log('getLatestPrice', productId);
	const p = await contract().getLatestPrice(productId);
	return formatUnits(p, 8);
}



export async function submitOrder(_baseId, _productId, isLong, existingPositionId, margin, leverage, releaseMargin) {
	_baseId = _baseId || get(baseId);
	_productId = _productId || get(productId);
	const base = getBaseInfo(_baseId);
	if (!base) return;
	const tx = await contract('', true).submitOrder(_baseId, _productId, isLong, existingPositionId || 0, parseUnits(margin, base.decimals), parseUnits(leverage, LEVERAGE_DECIMALS), releaseMargin);
	addPendingTransaction({
		hash: tx.hash,
		description: `Submit order ${margin}x${leverage} ${base.symbol} on ${get(productInfo).symbol}`
	});
}
