import { writable } from 'svelte/store'
import { showReadableError } from '../lib/errors'

export const toastMessage = writable(null);
export const toastType = writable(null);

export function showToast(message, type) {
	if (!type) {
		type = 'error';
		message = showReadableError(message);
	}
	toastMessage.set(message);
	toastType.set(type);
}

export function closeToast() {
	toastMessage.set(null);
	toastType.set(null);
}