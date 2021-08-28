<script>
	import { onMount } from 'svelte'
	import { toasts, hideToast } from '../stores/toasts'
	import { CANCEL_ICON } from '../lib/icons'
</script>

<style>
	.toast-container {
		position: absolute;
		top: var(--base-padding);
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
	.toast.info {
		background-color: var(--blue);
		color: var(--black-almost);
	}
	.text {
		padding: var(--base-padding);
	}
	.close {
		padding: var(--base-padding);
	}
	:global(.toast-wrapper .close svg) {
		height: 12px;
		width:  12px;
		margin-top: 1px;
		fill: #fff;
	}
	:global(.toast.info .close svg) {
		fill: var(--black-almost);
	}
</style>

<div class='toast-container'>
	<div class='toast-wrapper'>
		{#each $toasts as toast}
			<div class={`toast ${toast.type}`} data-intercept="true">
				<div class='text'>{toast.message}</div>
				<a class='close' on:click={() => {hideToast(toast.id)}}>{@html CANCEL_ICON}</a>
			</div>
		{/each}
	</div>
</div>