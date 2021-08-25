<script>
	import { hideModal } from '../stores/modals'

	import { CANCEL_ICON } from '../lib/icons'

	export let title;
</script>

<style>

	.modal-container {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgb(30,30,30,0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		width: 420px;
		border: 1px solid var(--gray-dark);
		border-radius: var(--base-radius);
		background-color: var(--gray-darkest);
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
		border-bottom: 1px solid var(--gray-dark);
	}

		.modal-title {
		}

		.modal-close {
			cursor: pointer;
		}

		:global(.modal-close svg) {
			height: 14px;
			width:  14px;
			margin-top: 4px;
			fill: #fff;
		}

	.modal-body {

	}

</style>

<div class='modal-container'>

	<div class='modal'>

		<div class='modal-header'>
			<div class='modal-title'>{title}</div>
			<span class='modal-close' on:click={hideModal}>{@html CANCEL_ICON}</span>
		</div>

		<div class='modal-body'>
			<slot></slot>
		</div>
		
	</div>

</div>