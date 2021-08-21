<script>
	import { onMount } from 'svelte'
	import { toasts, hideToast } from '../stores/toasts'
</script>

<style>
	.toast-container {
		position: absolute;
		top: 20px;
		left: 0;
		right: 0;
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.toast-wrapper {
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
		max-width: var(--container-width);
	}
	.toast {
		background-color: red;
	}
</style>

<div class='toast-container'>
	<div class='toast-wrapper'>
		{#each $toasts as toast}
			<div class='toast'>[{toast.type}] {toast.message} | <a on:click={() => {hideToast(toast.id)}}>Close</a></div>
		{/each}
	</div>
</div>