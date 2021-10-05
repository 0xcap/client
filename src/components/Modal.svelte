<script>

	import { CANCEL_ICON } from '../lib/icons'

	import { hideModal } from '../stores/modals'

	export let title = '';
	export let doneButton = false;
	export let isActive;
	export let noHeader = false;

	if (isActive == undefined) isActive = true;

</script>

<style>

	.modal-container {
		position: fixed;
		top: 0;
		left: 0;
		overflow-x: hidden;
		overflow-y: auto;
		right: 0;
		bottom: 0;
		background-color: rgb(0,0,0,0.524);
		z-index: 100;
		padding: 0 var(--base-padding);
		outline: 0;
		display: none;
		align-items: center;
		justify-content: center;
	}
	.modal-container.active {
		display: flex;
	}

	.modal {
		width: 460px;
		border: 1px solid var(--gray);
		border-radius: var(--base-radius);
		background-color: var(--less-black);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--base-padding);
		height: 60px;
		background-color: var(--gray);
	}

	.modal-title {
		font-weight: 600;
	}

	.modal-close {
		cursor: pointer;
	}

	.done-button {
		background-color: var(--green);
		padding: 6px 10px;
		border-radius: var(--base-radius);
		font-weight: 600;
		cursor: pointer;
		color: var(--less-black);
	}
	.done-button:hover {
		background-color: var(--green-dark);
	}

	:global(.modal-close svg) {
		height: 14px;
		width: 14px;
		margin-top: 4px;
		fill: #fff;
	}

	.modal-body {
		overflow-y: scroll;
		max-height: 85vh;
	}

</style>

<div class:active={isActive} class='modal-container no-scrollbar'>

	<div class='modal' data-intercept="true">

		{#if !noHeader}
		<div class='modal-header'>
			<div class='modal-title'>{title}</div>
			{#if doneButton}
			<span class='done-button' on:click={hideModal}>Done</span>
			{:else}
			<span class='modal-close' on:click={hideModal}>{@html CANCEL_ICON}</span>
			{/if}
		</div>
		{/if}

		<div class='modal-body no-scrollbar'>
			<slot></slot>
		</div>
		
	</div>

</div>