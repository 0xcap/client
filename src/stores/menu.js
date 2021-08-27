import { writable, get } from 'svelte/store'

export const menuVisible = writable(false);

export function toggleMenu() {
	menuVisible.set(!get(menuVisible));
}

export function hideMenu() {
	menuVisible.set(false);
}

