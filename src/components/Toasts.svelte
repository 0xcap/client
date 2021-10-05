<script>
	import { fade, fly } from 'svelte/transition'

	import { toast, hideToast } from '../stores/toasts'
	import { CANCEL_ICON } from '../lib/icons'
</script>

<style>

	.toast-container {
		position: fixed;
		top: var(--base-padding);
		left: 0;
		right: 0;
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.toast {
		border-radius: var(--base-radius);
		display: flex;
		justify-content: space-between;
		padding: 12px;
		background-color: #0D0D0D;
		max-width: 420px;
	}

	.toast.error {
		background-color: #290400;
		color: #FF1900;
		fill: #FF1900;
	}
	.toast.success {
		background-color: #002901;
		fill: var(--green);
		color: var(--green);
	}

	.body {
		padding-right: var(--base-padding);
		word-break: break-word;
		font-weight: 700;
	}

	:global(.toast .close svg) {
		height: 14px;
		width:  14px;
		margin-bottom: -2px;
		fill: inherit;
	}

</style>

{#if $toast}
<div class='toast-container'>
	<div class={`toast ${$toast.type || 'error'}`} data-intercept="true">
		<div class='body'>
			{$toast.message}
		</div>
		<a class='close' on:click={() => {hideToast()}}>{@html CANCEL_ICON}</a>
	</div>
</div>
{/if}