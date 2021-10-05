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
		background-color: var(--green);
		color: var(--gray-darkest);
		padding: 0 var(--base-padding);
		height: 64px;
		border-radius: var(--base-radius);
		font-weight: 700;
		font-size: 115%;
	}
	button:hover {
		background-color: var(--green-dark);
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