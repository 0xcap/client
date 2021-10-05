import { writable } from 'svelte/store'
import { parseErrorToString } from '../lib/errors'

export const toast = writable({message: 'Order submitted.', type: 'success'});

let timer;

export function showToast(data, type) {
	let message = parseErrorToString(data);
	if (!type) type = 'error';
	if (!message) return;
	toast.set({message: message, type});
	clearTimeout(timer);
	timer = setTimeout(() => {hideToast()}, 10*1000);
}

export function hideToast() {
	clearTimeout(timer);
	toast.set(null);
}