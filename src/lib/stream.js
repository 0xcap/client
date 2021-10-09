import { get } from 'svelte/store'
import { getPrice } from './api'
import { prices } from '../stores/prices'
import { selectedProductId, products } from '../stores/products'
import { selectedAddress } from '../stores/wallet'
import { PRODUCT_TO_ID } from './constants'
import { formatToDisplay, shortSymbol } from './utils'

let ws;
let lastTimestamp = {};
let h;

function setTitle(product, price) {
	document.title = `${shortSymbol(product)} ${formatToDisplay(price,0,true)} | Cap`;
}

function heartbeat() {
	clearTimeout(h);
	h = setTimeout(() => {
		console.log('Terminating, reconnecting socket...');
		if (ws) ws.close(1000,"");
		initWebsocket();
	}, 15 * 1000);
}

export function initWebsocket(_address) {

	if (!_address && !get(selectedAddress)) return;

	//console.log('initWebsocket');

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

		ws.send(JSON.stringify({
		    "type": "subscribe",
		    "product_ids": ['BTC-USD', 'ETH-USD'],
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

			if (!product_id || type != 'ticker') return;

			if (!lastTimestamp[product_id]) lastTimestamp[product_id] = 0;

			//if (lastTimestamp[product_id] > Date.now() - 1000) return; // throttle to 1 per sec

			lastTimestamp[product_id] = Date.now();

			const pid = PRODUCT_TO_ID[product_id];

			prices.update((x) => {
				x[pid] = price * 1;
				return x;
			});

			if (pid == get(selectedProductId)) {
				setTitle(product_id, price);
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

	

}