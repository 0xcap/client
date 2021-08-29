import { writable } from 'svelte/store'
import { parseErrorToString } from '../lib/errors'

export const toasts = writable([]);

let lastToastId = 1;
let timers = {};

export function showToast(data, type) {
	let message = parseErrorToString(data);
	if (!type) type = 'error';
	if (!message) return;
	toasts.update((x) => {
		x.unshift({message, type, id: lastToastId});
		return x;
	});
	let _id = lastToastId;
	clearTimeout(timers[_id]);
	timers[_id] = setTimeout(() => {hideToast(_id)}, 10*1000);
	lastToastId++;
}

export function hideToast(toastId) {
	if (toastId) clearTimeout(timers[toastId]);
	toasts.update((x) => {
		let new_toasts = [];
		for (const toast of x) {
			if (!toastId) clearTimeout(timers[toast.id]);
			if (toastId == toast.id) continue;
			new_toasts.push(toast);
		}
		return new_toasts;
	});
}