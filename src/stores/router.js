import { writable } from 'svelte/store'

import Trade from '../pages/Trade.svelte'
import Vault from '../pages/Vault.svelte'
import NotFound from '../pages/NotFound.svelte'

import { PRODUCT_TO_ID } from '../lib/constants'
import { selectProduct } from '../lib/helpers'

export const currentPage = writable('');
export const component = writable();

export function loadRoute(path) {
	if (!path || path == '/') {
		component.set(Trade);
		currentPage.set('trade');
	} else if (path.includes('/trade')) {
		// set product and component
		const product = path.split('/')[2];
		if (product && PRODUCT_TO_ID[product]) {
			selectProduct(PRODUCT_TO_ID[product]);
		}
		component.set(Trade);
		currentPage.set('trade');
	} else if (path.includes('/vault')) {
		component.set(Vault);
		currentPage.set('vault');
	} else {
		component.set(NotFound);
		currentPage.set('');
	}
}

export function navigateTo(path) {
	console.log('path', path);
    if (!path || path == '/') {
    	path = '';
    }
    window.history.pushState(null, null, path);
    loadRoute(path);
};

window.onpopstate = () => loadRoute(location.hash);