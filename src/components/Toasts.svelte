<script>
	import { toasts, hideToast } from '../stores/toasts'
	import { CANCEL_ICON } from '../lib/icons'
</script>

<style>
	.toast-container {
		position: fixed;
		top: 72px;
		right: var(--base-padding);
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.toast-wrapper {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 16px;
		max-width: 240px;
	}
	.toast {
		background-color: var(--gray-darkest);
		border-radius: 12px;
		display: flex;
		justify-content: space-between;
		border: 2px solid transparent;
	}
	.toast.error {
		color: var(--red);
		border-color: var(--red);
		fill: var(--red);;
	}
	.toast.success {
		color: var(--green);
		border-color: var(--green);
		fill: var(--green);;
	}
	.toast.info {
		color: var(--blue);
		border-color: var(--blue);
		fill: var(--blue);;
	}
	.text {
		line-height: 1.35;
		font-size: 95%;
	}
	.text, .close {
		padding: 12px;
	}
	:global(.toast-wrapper .close svg) {
		height: 12px;
		width:  12px;
		margin-bottom: -2px;
		fill: inherit;
	}
</style>

<div class='toast-container'>
	<div class='toast-wrapper'>
		{#each $toasts as toast}
			<div class={`toast ${toast.type || 'error'}`} data-intercept="true">
				<div class='text'>{toast.message}</div>
				<a class='close' on:click={() => {hideToast(toast.id)}}>{@html CANCEL_ICON}</a>
			</div>
		{/each}
	</div>
</div>