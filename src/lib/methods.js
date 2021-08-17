import { ethers } from 'ethers'
import { get } from 'svelte/store'
import { contract, getBases, getBase, getContractAddress } from './contracts'
import { address } from '../stores/provider'
import { PRODUCTS, PRICE_DECIMALS } from './constants'
import { toBytes32, fromBytes32, formatUnits, parseUnits } from './utils'

const formatPositions = function(positions, symbol) {
	const base = getBase(symbol);
	if (!base) return;
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			amount: formatUnits(p.amount, base.decimals),
			base: symbol,
			createdAt: p.createdAt.toNumber(),
			isLong: p.isLong,
			isSettling: p.isSettling,
			price: formatUnits(p.price, PRICE_DECIMALS),
			product: fromBytes32(p.product),
			realizedInterest: formatUnits(p.realizedInterest, base.decimals),
			updatedAt: p.updatedAt.toNumber()
		});
	}
	return formattedPositions;
}

/* todo
- check user base token allowance
- approve token spending
- submit order
- withdraw
- get user positions
- get UPL
- get balance, get locked
- events (for history)
- UI components: account (balance, locked), new order (base, product, amount), positions (upl, list), history (transactions, including pending ones), wallet, toast
- design like uniswap or https://community.optimism.io/ - super simple
*/

// Public

export async function listBases() {
	const obj = getBases();
	let list = [];
	for (const symbol in obj) {
		list.push({
			symbol,
			address: obj[symbol].address,
			decimals: obj[symbol].decimals
		});
	}
	return list;
}

export async function getLatestPrice(product) {
	const p = await contract().getLatestPrice(PRODUCTS[product]);
	return formatUnits(p, 8);
}

export async function getUserBalance(symbol) {
	const base = getBase(symbol);
	if (!base) return;
	const b = await contract().balances(get(address), base.address);
	return formatUnits(b, base.decimals);
}

export async function getUserLocked(symbol) {
	const base = getBase(symbol);
	if (!base) return;
	const l = await contract().locked(get(address), base.address);
	return formatUnits(l, base.decimals);
}

export async function getUserAllowance(symbol, contractName) {
	if (!contractName) contractName = 'TRADING';
	const base = getBase(symbol);
	if (!base) return;
	const allowance = await contract(symbol).allowance(get(address), getContractAddress(contractName));
	return formatUnits(allowance, base.decimals);
}

export async function getUserPositions(symbol) {
	const base = getBase(symbol);
	if (!base) return;
	const positions = await contract().getUserPositions(get(address), base.address);
	return formatPositions(positions, symbol);
}

export async function getUPL(symbol) {
	const base = getBase(symbol);
	if (!base) return;
	const upl = await contract().getUPL(get(address), base.address);
	return formatUnits(upl, base.decimals);
}

// Signer required

export async function approveAllowance(symbol, amount, contractName) {
	if (!amount) amount = 10n**27n; // 1 billion at 10^18
	if (!contractName) contractName = 'TRADING';
	const base = getBase(symbol);
	if (!base) return;
	const tx = await contract(symbol, true).approve(getContractAddress(contractName), amount);
	console.log('tx', tx);
}

export async function deposit(symbol, amount) {
	const base = getBase(symbol);
	if (!base) return;
	const tx = await contract('TRADING', true).deposit(base.address, parseUnits(amount, base.decimals));
	console.log('tx', tx);
}

export async function withdraw(symbol, amount) {
	const base = getBase(symbol);
	if (!base) return;
	const tx = await contract('TRADING', true).withdraw(base.address, parseUnits(amount, base.decimals));
	console.log('tx', tx);
}

export async function submitOrder(symbol, product, isLong, amount) {
	const base = getBase(symbol);
	if (!base) return;
	const tx = await contract('TRADING', true).submitOrder(base.address, toBytes32(product), isLong, parseUnits(amount, base.decimals));
	console.log('tx', tx);
}
