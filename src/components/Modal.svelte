<script>

	import { CANCEL_ICON } from '../lib/icons'

	import { hideModal } from '../stores/modals'

	export let title;
	export let doneButton = false;

</script>

<style>

	.modal-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgb(0,0,0,0.524);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		width: 460px;
		border: 1px solid rgb(30,30,30);
		border-radius: var(--base-radius);
		background-color: rgb(25,25,25);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--base-padding);
		height: 62px;
		background-color: rgb(30,30,30);
	}

	.modal-title {
		font-weight: 600;
	}

	.modal-close {
		cursor: pointer;
	}

	.done-button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 6px 14px;
		border-radius: 14px;
		font-weight: 650;
		cursor: pointer;
	}
	.done-button:hover {
		background-color: var(--blue-dark);
	}

	:global(.modal-close svg) {
		height: 14px;
		width: 14px;
		margin-top: 4px;
		fill: #fff;
	}

	.modal-body {
		overflow-y: scroll;
		max-height: 80vh;
	}

</style>

<div class='modal-container no-scrollbar'>

	<div class='modal' data-intercept="true">

		<div class='modal-header'>
			<div class='modal-title'>{title}</div>
			{#if doneButton}
			<a class='done-button' on:click={hideModal}>Done</a>
			{:else}
			<span class='modal-close' on:click={hideModal}>{@html CANCEL_ICON}</span>
			{/if}
		</div>

		<div class='modal-body no-scrollbar'>
			<slot></slot>
		</div>
		
	</div>

</div>