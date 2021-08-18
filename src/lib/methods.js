import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBase, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { CONTRACTS, BASES, PRODUCTS, PRICE_DECIMALS, LEVERAGE_DECIMALS, ERC20_ABI } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const formatPositions = function(positions, baseId) {
	const base = getBase(baseId);
	if (!base) return;
	let formattedPositions = [];
	console.log('P', positions);
	for (const p of positions) {
		console.log('p---', p);
		formattedPositions.push({
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

// Public

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

export function getBaseInfo(baseId) {
	return getBase(baseId);
}

export async function getUserBaseBalance(baseId) {
	const base = getBase(baseId);
	if (!base) return;
	console.log('base', base, base.symbol, get(address));
	const balance = await contract(base.symbol).balanceOf(get(address));
	console.log('balance', balance);
	return formatUnits(balance, base.decimals);
}

export async function getLatestPrice(productId) {
	console.log('getLatestPrice', productId);
	const p = await contract().getLatestPrice(productId);
	return formatUnits(p, 8);
}

export async function getProductInfo(productId) {
	const productInfo = await contract().getProduct(productId);
	//console.log('productInfo FEE', productInfo.fee);
	return formatProductInfo(productInfo);
	//return formatPositions(positions, baseId);
}

export async function getUserAllowance(baseId, contractName) {
	const base = getBase(baseId);
	if (!base) return;
	const allowance = await contract(base.symbol).allowance(get(address), getContractAddress(contractName));
	return formatUnits(allowance, base.decimals);
}

export async function getUserPositions(baseId) {
	const positions = await contract().getUserPositions(get(address), baseId);
	return formatPositions(positions, baseId);
}

export async function getUserStaked(baseId) {
	const base = getBase(baseId);
	if (!base) return;
	const staked = await contract().getUserStaked(get(address), baseId);
	return formatUnits(staked, base.decimals);
}

// Signer required

export async function approveUserAllowance(baseId, amount, contractName) {
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	const base = getBase(baseId);
	if (!base) return;
	const tx = await contract(base.symbol, true).approve(getContractAddress(contractName), amount);
	console.log('tx', tx);
}

export async function stake(baseId, amount) {
	const base = getBase(baseId);
	if (!base) return;
	const tx = await contract('', true).stake(baseId, parseUnits(amount, base.decimals));
	console.log('tx', tx);
}

export async function submitOrder(baseId, productId, isLong, existingPositionId, margin, leverage, releaseMargin) {
	const base = getBase(baseId);
	if (!base) return;
	const tx = await contract('', true).submitOrder(baseId, productId, isLong, existingPositionId || 0, parseUnits(margin, base.decimals), parseUnits(leverage, LEVERAGE_DECIMALS), releaseMargin);
	console.log('tx', tx);
}
