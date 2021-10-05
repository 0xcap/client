import { get } from 'svelte/store'
import { getPrice } from './api'
import { prices, open24h } from '../stores/prices'
import { products } from '../stores/products'
import { PRODUCT_TO_ID } from '../lib/constants'

let ws;
let lastTimestamp = 0;
let h;

let productIds = [];

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

export async function subscribeToProducts(_productIds) {

	console.log('subscribeToProducts', _productIds);

	if (_productIds.length > 0 && arrayEquals(_productIds, productIds)) return;

	let newProductsIds = _productIds.filter(x => !productIds.includes(x));

	console.log('newProductsIds', newProductsIds);

	let _products = get(products);

	if (!_products[1]) return;

	for (const pid of newProductsIds) {
		// fetch price with REST
		const price = await getPrice(_products[pid]);
		console.log('got price', pid, price);
		prices.update((x) => {
			x[pid] = price;
			return x;
		});
	}

	productIds = _productIds;

	if (!productIds || !productIds.length) return;

	if (!ws || ws.readyState != 1) {
		initWebsocket(productIds);
		return;
	}
	
	let product_ids = [];
	for (const pid of productIds) {
		product_ids.push(_products[pid]);
	}

	ws.send(JSON.stringify({
	    "type": "unsubscribe",
	    "channels": [
	        "ticker"
	    ]
	}));

	console.log('subscribing', product_ids);
	ws.send(JSON.stringify({
	    "type": "subscribe",
	    "product_ids": product_ids,
	    "channels": [
	        "ticker"
	    ]
	}));

}

function initWebsocket() {

	console.log('initWebsocket', productIds);

	if (ws) {
		try {
			ws.close(3335,"");
		} catch(e) {};
		ws = null;
		clearTimeout(h);
	}

	ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

	ws.onopen = (e) => {

		if (ws.readyState != 1) return;

		heartbeat();

		if (!productIds) productIds = [];

		let _products = get(products);
		let product_ids = [];
		for (const pid of productIds) {
			product_ids.push(_products[pid]);
		}

		console.log('subscribing2', product_ids);
		ws.send(JSON.stringify({
		    "type": "subscribe",
		    "product_ids": product_ids,
		    "channels": [
		    	"heartbeat",
		    	"ticker"
		    ]
		}));

	}

	ws.onmessage = (e) => {

		try {
			const message = JSON.parse(e.data);

			const { type, product_id, open_24h, price } = message;

			if (type == 'heartbeat') return heartbeat();

			// TODO: this should be per product
			if (lastTimestamp > Date.now() - 1000) return; // throttle to 1 per sec

			if (product_id) lastTimestamp = Date.now();

			if (type == 'ticker') {
				prices.update((x) => {
					x[PRODUCT_TO_ID[product_id]] = price;
					return x;
				});
				open24h.update((x) => {
					x[PRODUCT_TO_ID[product_id]] = open_24h;
					return x;
				});
			}

		} catch(e) {
			console.error(e);
		}

	}

	ws.onclose = (e) => {

		console.log('Socket closed', e.code, e);

		if (e.wasClean) {

		} else {

		}

		if (e.code != 3335) {
			initWebsocket();
		}

	}

	ws.onerror = (e) => {
		console.log('Websocket error', e);
	}

	function heartbeat() {
		clearTimeout(h);
		h = setTimeout(() => {
			console.log('Terminating, reconnecting socket...');
			ws.close(1000,"");
			initWebsocket();
		}, 15 * 1000);
	}

}