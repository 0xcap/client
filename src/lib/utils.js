import { ethers } from 'ethers'
import { get } from 'svelte/store'

import { CHAIN_DATA, LEVERAGE_DECIMALS, PRICE_DECIMALS, BASE_SYMBOL } from './constants'
import { activateProductPrices } from './helpers'

import { hideMenu } from '../stores/menu'
import { hideModal } from '../stores/modals'
import { products, selectedProductId } from '../stores/products'
import { hideToast } from '../stores/toasts'
import { chainId } from '../stores/wallet'


export function formatUnits(number, units) {
  return ethers.utils.formatUnits(number || 0, units || 18);
}

export function parseUnits(number, units) {
  if (typeof(number) == 'number') number = number.toString();
  return ethers.utils.parseUnits(number, units || 18);
}

export function intify(number) {
	if (parseInt(number * 1) == number * 1) return parseInt(number);
	return number;
}

export function shortAddr(_address) {
	if (!_address) return;
	return _address.substring(0,6) + '...' + _address.slice(-4);
}

export function formatToDisplay(amount, precision) {
	if (isNaN(amount)) return 0;
	if (precision) return (amount * 1).toFixed(precision);
	if ((amount * 1).toFixed(6)*1 == Math.round(amount * 1)) return Math.round(amount);
	if (amount * 1 >= 1000 || amount * 1 <= -1000) {
		return Math.round(amount*1).toLocaleString();
	} else if (amount * 1 >= 100 || amount * 1 <= -100) {
		return (amount * 1).toFixed(2);
	} else if (amount * 1 >= 10 || amount * 1 <= -10) {
		return (amount * 1).toFixed(3);
	} else {
		return (amount * 1).toFixed(4);
	}
}

export function formatPnl(pnl, isPercent) {
	let string = '';
	if (pnl * 1 > 0) {
		string += '+';
	}
	string += formatToDisplay(pnl, isPercent ? 2 : null) || 0;
	return string;
}

export function formatPositions(positions) {
	let formattedPositions = [];
	for (const p of positions) {
		formattedPositions.push({
			positionId: p.positionId && p.positionId.toNumber(),
			product: get(products)[p.productId],
			timestamp: p.timestamp.toNumber(),
			isLong: p.isLong,
			isSettling: p.isSettling,
			margin: formatUnits(p.margin),
			leverage: formatUnits(p.leverage),
			amount: formatUnits(p.margin) * formatUnits(p.leverage),
			price: formatUnits(p.price, PRICE_DECIMALS),
			productId: p.productId
		});
		activateProductPrices(p.productId);
	}
	formattedPositions.reverse();
	return formattedPositions;
}

export function formatVault(v) {
	return {
		symbol: BASE_SYMBOL,
		cap: formatUnits(v.cap),
		maxOpenInterest: formatUnits(v.maxOpenInterest),
		maxDailyDrawdown: formatUnits(v.maxDailyDrawdown, 2),
		stakingPeriod: v.stakingPeriod,
		redemptionPeriod: v.redemptionPeriod,
		protocolFee: formatUnits(v.protocolFee,2),
		openInterest: formatUnits(v.openInterest),
		balance: formatUnits(v.balance),
		staked: formatUnits(v.staked),
		isActive: v.isActive
	}
}

export function formatProduct(p, productId) {
	return {
		symbol: get(products)[productId],
		leverage: formatUnits(p.leverage, LEVERAGE_DECIMALS),
		fee: formatUnits(p.fee, 2),
		interest: formatUnits(p.interest, 2),
		feed: p.feed,
		settlementTime: p.settlementTime,
		minTradeDuration: p.minTradeDuration,
		liquidationThreshold: formatUnits(p.liquidationThreshold, 2),
		liquidationBounty: formatUnits(p.liquidationBounty, 2),
		isActive: p.isActive
	}
}

export function formatEvent(ev) {

	if (ev.event == 'ClosePosition') {

		const { positionId, user, productId, price, margin, leverage, pnl, protocolFee, wasLiquidated } = ev.args;

		return {
			type: 'ClosePosition',
			positionId: positionId && positionId.toNumber(),
			product: get(products)[productId],
			price: formatUnits(price, PRICE_DECIMALS),
			margin: formatUnits(margin),
			leverage: formatUnits(leverage),
			amount: formatUnits(margin) * formatUnits(leverage),
			pnl: formatUnits(pnl),
			protocolFee: formatUnits(protocolFee),
			wasLiquidated,
			txHash: ev.transactionHash,
			block: ev.blockNumber,
			productId: productId
		};

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

export function catchLinks(cb) {

	window.addEventListener('click', (ev) => {

      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
          return true;
      }
      
      let anchor = null;
      for (let n = ev.target; n.parentNode; n = n.parentNode) {
          if (n.nodeName === 'A') {
              anchor = n;
              break;
          }
      }

      if (!anchor) return true;
      
      let href = anchor.getAttribute('href');
      
      if (!href || href && href.includes('http')) return true;
      
      ev.preventDefault();
      
      cb(href);

      return false;

  });

}

export function hidePopoversOnClick() {

	window.addEventListener('click', (ev) => {

      if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.defaultPrevented) {
          return true;
      }
      
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