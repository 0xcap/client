<script>

	import { CANCEL_ICON } from '../lib/icons'

	import { hideModal } from '../stores/modals'

	export let title;

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
		border: 1px solid var(--gray-between);
		border-radius: var(--base-radius);
		background-color: rgb(25,25,25);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
		border-bottom: 1px solid var(--gray-dark);
	}

	.modal-close {
		cursor: pointer;
	}

	:global(.modal-close svg) {
		height: 14px;
		width: 14px;
		margin-top: 4px;
		fill: #fff;
	}

</style>

<div class='modal-container'>

	<div class='modal' data-intercept="true">

		<div class='modal-header'>
			<div class='modal-title'>{title}</div>
			<span class='modal-close' on:click={hideModal}>{@html CANCEL_ICON}</span>
		</div>

		<div class='modal-body'>
			<slot></slot>
		</div>
		
	</div>

</div>