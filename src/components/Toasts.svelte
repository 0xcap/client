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
		max-width: 280px;
	}
	.toast {
		background-color: rgb(23,23,23);
		border-radius: 8px;
		display: flex;
		justify-content: space-between;
		padding: 16px;
	}

	.body {
		padding-right: var(--base-padding);
	}

	.title {
		font-weight: 700;
		text-transform: capitalize;
		margin-bottom: 4px;
	}
	.text {
		line-height: 1.45;
	}

	.toast.error {
		border: 2px solid var(--red);
		color: var(--red);
		fill: var(--red);
	}
	.toast.success {
		border: 2px solid var(--green);
		color: var(--green);
		fill: var(--green);;
	}
	.toast.transaction {
		border: 2px solid var(--blue);
		color: var(--blue);
		fill: var(--blue);;
	}

	:global(.toast-wrapper .close svg) {
		height: 14px;
		width:  14px;
		margin-bottom: -2px;
		fill: inherit;
	}
</style>

<div class='toast-container'>
	<div class='toast-wrapper'>
		{#each $toasts as toast}
			<div class={`toast ${toast.type || 'error'}`} data-intercept="true">
				<div class='body'>
					<div class='title'>{toast.type}</div>
					<div class='text'>{toast.message}</div>
				</div>
				<a class='close' on:click={() => {hideToast(toast.id)}}>{@html CANCEL_ICON}</a>
			</div>
		{/each}
	</div>
</div>