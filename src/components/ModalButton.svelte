<script>
	export let isDisabled;
	export let isPending;
	export let action;
	export let label;
</script>

<style>

	.button-wrap {
		border-top: 1px solid rgb(30,30,30);
		padding: var(--base-padding);
	}

	button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: var(--base-padding);
		border-radius: 14px;
		font-weight: 650;
		font-size: 115%;
	}
	button:hover {
		background-color: var(--blue-dark);
	}

	button.disabled {
		background-color: var(--gray-dark);
		color: var(--gray-light);
		pointer-events: none;
		cursor: default;
	}

</style>


<div class='button-wrap'>
	<button class:disabled={isDisabled || isPending} on:click={action}>{label}</button>
</div>