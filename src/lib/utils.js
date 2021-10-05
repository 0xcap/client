import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA, PRICE_DECIMALS, BASE_SYMBOL } from './constants'
import { activateProductPrices } from './helpers'

import { hideMenu } from '../stores/menu'
import { hideModal } from '../stores/modals'
import { products, selectedProductId } from '../stores/products'
import { hideToast } from '../stores/toasts'
import { chainId } from '../stores/wallet'


export function formatUnits(number, units) {
  return ethers.utils.formatUnits(number || 0, units || 8);
}

export function parseUnits(number, units) {
  if (typeof(number) == 'number') {
  	number = number.toFixed(units || 8);
  }
  return ethers.utils.parseUnits(number, units || 8);
}

export function intify(number) {
	if (parseInt(number * 1) == number * 1) return parseInt(number);
	return number;
}

export function shortAddr(_address) {
	if (!_address) return;
	return _address.substring(0,2) + '…' + _address.slice(-6);
}

export function shortSymbol(symbol) {
	if (!symbol) return '';
	return symbol.substring(0,symbol.length-4);
}

export function formatToDisplay(amount, maxPrecision, fixPrecision) {
	if (amount == undefined || isNaN(amount)) return '';
	if (!maxPrecision) maxPrecision = 100;

	if (!fixPrecision && (amount*1 == 0 || amount * 1 >= 1) && (amount * 1).toFixed(3)*1 == Math.round(amount * 1)) return Math.round(amount).toLocaleString();
	
	if (amount * 1 >= 1000 || amount * 1 <= -1000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 100 || amount * 1 <= -100) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 1 || amount * 1 <= -1) {
		return (amount * 1).toFixed(Math.min(maxPrecision,3));
	} else if (amount * 1 >= 0.1 || amount * 1 <= -0.1) {
		return (amount * 1).toFixed(Math.min(maxPrecision,5));
	} else {
		return (amount * 1).toFixed(Math.min(maxPrecision,6));
	}
}

export function displayPricePercentChange(last, initial) {
	if (!last || !initial) return '';
	const diff = (last * 1 - initial * 1) / initial;
	let string = '';
	if (diff >= 0) {
		string += '+';
	}
	string += formatToDisplay(diff*100, 2, true) + "%" || '';
	return string;
}

export function formatPnl(pnl, pnlIsNegative, isPercent) {
	let string = '';
	if (pnl == undefined) return string;
	if (pnlIsNegative == undefined) {
		pnlIsNegative = pnl < 0;
	}
	if (!pnlIsNegative) {
		string += '+';
	} else if (pnl > 0) {
		string += '-';
	}
	string += formatToDisplay(pnl, isPercent ? 2 : null) || 0;
	return string;
}

export function formatPositions(positions, positionIds) {
	let formattedPositions = [];
	let i = 0;
	for (const p of positions) {
		if (!p.productId) {
			i++;
			continue;
		}
		formattedPositions.push({
			positionId: positionIds[i],
			product: get(products)[p.productId],
			timestamp: p.timestamp,
			isLong: p.isLong,
			margin: formatUnits(p.margin),
			leverage: formatUnits(p.leverage),
			amount: formatUnits(p.margin) * formatUnits(p.leverage),
			price: formatUnits(p.price, PRICE_DECIMALS),
			productId: p.productId,
			closeOrderId: p.closeOrderId
		});
		activateProductPrices(p.productId);
		i++;
	}
	formattedPositions.reverse();
	return formattedPositions;
}

export function formatTrades(trades, blockNumber, txHash) {
	let formattedTrades = [];
	for (const t of trades) {
		formattedTrades.push({
			positionId: t.positionId,
			orderId: t.orderId,
			productId: t.productId,
			product: get(products)[t.productId],
			price: formatUnits(t.closePrice || t.price, PRICE_DECIMALS),
			entryPrice: formatUnits(t.entryPrice, PRICE_DECIMALS),
			margin: formatUnits(t.margin),
			leverage: formatUnits(t.leverage),
			amount: formatUnits(t.margin) * formatUnits(t.leverage),
			timestamp: t.timestamp,
			isLong: t.isLong,
			pnl: formatUnits(t.pnl),
			pnlIsNegative: t.pnlIsNegative,
			isFullClose: t.isFullClose,
			wasLiquidated: t.wasLiquidated,
			txHash: t.txHash || t.transactionHash || txHash,
			block: t.blockNumber || blockNumber
		});
	}
	return formattedTrades;
}

export function formatProduct(p, productId) {
	return {
		symbol: get(products)[productId],
		maxLeverage: formatUnits(p.maxLeverage),
		maxExposure: formatUnits(p.maxExposure),
		openInterestLong: formatUnits(p.openInterestLong),
		openInterestShort: formatUnits(p.openInterestShort),
		fee: formatUnits(p.fee, 2),
		interest: formatUnits(p.interest, 2),
		feed: p.feed,
		minTradeDuration: p.minTradeDuration,
		oracleMaxDeviation: formatUnits(p.oracleMaxDeviation, 2),
		isActive: p.isActive
	}
}

export function formatEvent(ev) {

	if (ev.event == 'ClosePosition') {

		const { positionId, orderId, user, productId, isLong, price, entryPrice, margin, leverage, pnl, pnlIsNegative, isFullClose, wasLiquidated } = ev.args;

		return {
			type: 'ClosePosition',
			positionId: positionId && positionId.toNumber(),
			orderId: orderId && orderId.toNumber(),
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			entryPrice: formatUnits(entryPrice, PRICE_DECIMALS),
			margin: formatUnits(margin),
			leverage: formatUnits(leverage),
			amount: formatUnits(margin) * formatUnits(leverage),
			pnl: formatUnits(pnl),
			isLong,
			pnlIsNegative,
			isFullClose,
			wasLiquidated,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId
		};

	} else if (ev.event == 'NewPosition') {

		const { positionId, closeOrderId, user, productId, price, margin, leverage, isLong } = ev.args;

		return {
			type: 'NewPosition',
			positionId: positionId && positionId.toNumber(),
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			margin: formatUnits(margin),
			leverage: formatUnits(leverage),
			amount: formatUnits(margin) * formatUnits(leverage),
			isLong,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId,
			closeOrderId: closeOrderId
		}

	}

}

export function txLink(hash) {
	const explorer = CHAIN_DATA[get(chainId)]['explorer'];
	return `${explorer}/tx/${hash}`; 
}

export function addrLink(addr) {
	const explorer = CHAIN_DATA[get(chainId)]['explorer'];
	return `${explorer}/address/${addr}`; 
}

export function getCachedLeverage(productId) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		try {
			cl = JSON.parse(cl);
			return cl[productId] * 1;
		} catch(e) {}
	} else {
		return null;
	}
}

export function setCachedLeverage(productId, _leverage) {
	let cl = localStorage.getItem('cachedLeverages');
	if (cl) {
		cl = JSON.parse(cl);
		cl[productId] = _leverage * 1;
		localStorage.setItem('cachedLeverages', JSON.stringify(cl));
	} else {
		localStorage.setItem('cachedLeverages', JSON.stringify({[productId]: _leverage}));
	}
}

export function hidePopoversOnClick() {

	window.addEventListener('click', (ev) => {

      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
          return true;
      }
      
      if (ev.target && ev.target.getAttribute('data-intercept')) return true;

      let interceptor = null;
      for (let n = ev.target; n.parentNode; n = n.parentNode) {
          if (n.getAttribute('data-intercept')) {
              interceptor = true;
              break;
          }
      }

      if (interceptor) return true;

      hideModal();
      hideMenu();

  });

  window.addEventListener('keydown', (ev) => {
  	if (ev.key == 'Escape') {
  		hideModal();
  		hideMenu();
  		hideToast();
  	}
  })

}