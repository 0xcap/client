import { writable } from 'svelte/store'

export const activeModal = writable({});

export function showModal(name, data) {
	activeModal.set({name, data});
}

export function hideModal() {
	activeModal.set({});
}