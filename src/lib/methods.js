import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBaseInfo, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { addPendingTransaction } from '../stores/transactions'
import { baseId, productId } from '../stores/order'


import { CONTRACTS, BASES, PRODUCTS, PRICE_DECIMALS, LEVERAGE_DECIMALS, ERC20_ABI } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const formatPositions = function(positions, baseId) {
	const base = getBaseInfo(baseId);
	if (!base) return;
	let formattedPositions = [];
	console.log('P', positions);
	for (const p of positions) {
		console.log('p---', p);
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

const formatProductInfo = function(p) {
	return {
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
	for (const baseId in obj) {
		list.push({
			symbol: obj[baseId].symbol,
			address: obj[baseId].address,
			decimals: obj[baseId].decimals
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
	const productInfo = await contract().getProduct(_productId);
	return formatProductInfo(productInfo);
}

// User

export async function getUserBaseBalance(_baseId, _address) {
	const base = getBaseInfo(_baseId);
	console.log('base', base, base.symbol, _address);
	const balance = await contract(base.symbol).balanceOf(_address);
	console.log('balance', balance);
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
	console.log('tx', tx);
	addPendingTransaction({
		hash: tx.hash,
		description: `Approve ${base.symbol}`
	});
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
	console.log('tx', tx);
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


export async function getUserPositions(baseId) {
	const positions = await contract().getUserPositions(get(address), baseId);
	return formatPositions(positions, baseId);
}



// Signer required



export async function submitOrder(baseId, productId, isLong, existingPositionId, margin, leverage, releaseMargin) {
	const base = getBaseInfo(baseId);
	if (!base) return;
	const tx = await contract('', true).submitOrder(baseId, productId, isLong, existingPositionId || 0, parseUnits(margin, base.decimals), parseUnits(leverage, LEVERAGE_DECIMALS), releaseMargin);
	console.log('tx', tx);
}
