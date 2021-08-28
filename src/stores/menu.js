import { writable, get } from 'svelte/store'
import { hideToast } from './toasts'

export const menuVisible = writable(false);

export function toggleMenu() {
	hideToast();
	menuVisible.set(!get(menuVisible));
}

export function hideMenu() {
	menuVisible.set(false);
}

