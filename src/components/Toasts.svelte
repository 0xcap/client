<script>
	import { onMount } from 'svelte'
	import { toasts, hideToast } from '../stores/toasts'
</script>

<style>
	.toast-container {
		position: absolute;
		top: 0;
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
		background-color: var(--red);
		border-radius: var(--base-radius);
		display: flex;
		justify-content: space-between;
	}
	.text {
		padding: var(--base-padding);
	}
	.close {
		padding: var(--base-padding);
	}
</style>

<div class='toast-container'>
	<div class='toast-wrapper'>
		{#each $toasts as toast}
			<div class='toast'>
				<div class='text'>{toast.message}</div>
				<a class='close' on:click={() => {hideToast(toast.id)}}>Close</a>
			</div>
		{/each}
	</div>
</div>