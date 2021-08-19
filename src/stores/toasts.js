import { writable } from 'svelte/store'
import { parseErrorToString } from '../lib/errors'

export const toasts = writable([]);

let lastToastId = 1;

export function showToast(data, type) {
	let message = parseErrorToString(data);
	if (!type) type = 'error';
	toasts.update((x) => {
		x.unshift({message, type, id: lastToastId});
		return x;
	});
	lastToastId++;
}

export function hideToast(toastId) {
	toasts.update((x) => {
		let new_toasts = [];
		for (const toast of x) {
			if (toastId == toast.id) continue;
			new_toasts.push(toast);
		}
		return new_toasts;
	});
}