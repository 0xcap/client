import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBase, getProduct, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { PRODUCTS, PRICE_DECIMALS, LEVERAGE_DECIMALS } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const formatPositions = function(positions, baseId) {
	const base = getBase(baseId);
	if (!base) return;
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			base: base.symbol,
			product: getProduct(p.productId).symbol,
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

export async function getLatestPrice(productId) {
	console.log('getLatestPrice', productId);
	const product = getProduct(productId);
	if (!product) return;
	const p = await contract().getLatestPrice(product.feed);
	return formatUnits(p, 8);
}

export async function getUserAllowance(baseId, contractName) {
	if (!contractName) contractName = 'TRADING';
	const base = getBase(baseId);
	if (!base) return;
	const allowance = await contract(base.symbol).allowance(get(address), getContractAddress(contractName));
	return formatUnits(allowance, base.decimals);
}

export async function getUserPositions(baseId) {
	const base = getBase(baseId);
	if (!base) return;
	const positions = await contract().getUserPositions(get(address), base.address);
	return formatPositions(positions, baseId);
}

// Signer required

export async function approveAllowance(baseId, amount, contractName) {
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	if (!contractName) contractName = 'TRADING';
	const base = getBase(baseId);
	if (!base) return;
	const tx = await contract(base.symbol, true).approve(getContractAddress(contractName), amount);
	console.log('tx', tx);
}

export async function submitOrder(baseId, productId, isLong, existingPositionId, margin, leverage, releaseMargin) {
	const base = getBase(baseId);
	if (!base) return;
	const product = getProduct(productId);
	if (!product) return;
	const tx = await contract('TRADING', true).submitOrder(baseId, productId, isLong, existingPositionId || 0, parseUnits(margin, base.decimals), parseUnits(leverage, LEVERAGE_DECIMALS), releaseMargin);
	console.log('tx', tx);
}
