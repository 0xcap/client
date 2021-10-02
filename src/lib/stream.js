import { get } from 'svelte/store'
import { prices } from '../stores/prices'
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

	productIds = _productIds;

	if (!productIds || !productIds.length) return;

	if (!ws || ws.readyState != 1) {
		initWebsocket(productIds);
		return;
	}

	let _products = get(products);
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

	ws.send(JSON.stringify({
	    "type": "subscribe",
	    "product_ids": product_ids,
	    "channels": [
	        "ticker"
	    ]
	}));

}

function initWebsocket() {

	console.log('initWebsocket');

	ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

	ws.onopen = (e) => {

		let _products = get(products);
		let product_ids = [];
		for (const pid of productIds) {
			product_ids.push(_products[pid]);
		}

		ws.send(JSON.stringify({
		    "type": "subscribe",
		    "product_ids": product_ids,
		    "channels": [
		    	"heartbeat",
		        "ticker"
		    ]
		}));

		heartbeat();

	}

	ws.onmessage = (e) => {

		try {
			const message = JSON.parse(e.data);

			const { type, product_id, sequence, price } = message;

			if (type == 'heartbeat') return heartbeat();

			// TODO: this should be per product
			if (lastTimestamp > Date.now() - 1000) return; // throttle to 1 per sec

			if (product_id) lastTimestamp = Date.now();

			if (type == 'ticker') {
				//console.log('price', PRODUCT_TO_ID[product_id], price);
				prices.update((x) => {
					x[PRODUCT_TO_ID[product_id]] = price;
					return x;
				});
			}

		} catch(e) {
			console.error(e);
		}

	}

	ws.onclose = (e) => {

		console.log('Socket closed', e);

		if (e.wasClean) {

		} else {

		}

		initWebsocket();

	}

	ws.onerror = (e) => {
		ws.close(1,"");
	}

	function heartbeat() {
		clearTimeout(h);
		h = setTimeout(() => {
			console.log('Terminating, reconnecting socket...');
			ws.close(2,"");
			initWebsocket();
		}, 15 * 1000);
	}

}