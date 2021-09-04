<script>

	import { onMount } from 'svelte'

	import { BASE_SYMBOL } from '../lib/constants'

	export let data;
	export let value = '';

	let amountIsFocused = false;
	onMount(() => {
		document.getElementById('amount').focus();
	});

</script>

<style>

	.data-list {
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid rgb(30,30,30);
		padding: var(--base-padding);
	}

	.row:last-child {
		border-bottom: none;
	}

	.input-row {
		border-bottom: 2px solid rgb(55,55,55);
	}

	.input-row .label {
		font-weight: 600;
	}

	.input-row.focused {
		border-color: var(--blue);
	}

	input {
		text-align: right;
	}

	.input-wrap {
		flex: 1 1 auto;
	}

	.label {
		color: var(--gray-light);
	}

	.label-tool {
		font-size: 80%;
	}

	.error {
		color: var(--orange);
	}

	.dim {
		color: var(--gray-light);
	}

	:global(.row .value svg) {
		fill: var(--blue);
		height: 16px;
		margin-bottom: -3px;
	}

</style>


<div class='data-list'>
	{#each data as row}
		{#if row.type == 'input'}
			<div class='row input-row' class:focused={amountIsFocused}>
				<div class='label'>
					<span>{row.label}</span>
					{#if row.labelTool}
					<a class='label-tool' on:click={row.labelTool.action}>{row.labelTool.text}</a>
					{/if}
				</div>
				<div class='value input-wrap'>
					<input id='amount' type=number bind:value={value} min=0 max=10000000 on:keyup={row.onKeyUp} on:focus={() => {amountIsFocused = true}} on:blur={() => {amountIsFocused = false}} placeholder={`0 ${BASE_SYMBOL}`}> 
				</div>
			</div>
		{:else}
			<div class='row'>
				<div class='label'>{row.label}</div>
				<div class:error={!row.isEmpty && row.hasError} class:dim={row.dim} class='value'>
					{#if row.renderHTML}
						{@html row.value}
					{:else if row.isEmpty}
						-
					{:else}
						{row.value}
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>