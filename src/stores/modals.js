import { writable } from 'svelte/store'

export const activeModal = writable({});

export const showHero = writable(true);

export function showModal(name, data) {
	activeModal.set({name, data});
}

export function hideModal() {
	activeModal.set({});
}