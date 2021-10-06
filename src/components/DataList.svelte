<script>

	import { onMount } from 'svelte'

	import Helper from './Helper.svelte'

	import { BASE_SYMBOL } from '../lib/constants'

	import { showModal } from '../stores/modals'

	export let data;
	export let value = '';

	let amountIsFocused = false;
	onMount(() => {
		document.getElementById('amount') && document.getElementById('amount').focus();
	});

</script>

<style>

	.data-list {
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--jet-dim);
		padding: var(--base-padding);
	}

	.row:last-child {
		border-bottom: none;
	}

	.input-row {
		border-bottom: 2px solid var(--jet-dim);
	}

	.input-row .label {
		font-weight: 700;
		color: #fff !important;
	}

	.input-row.focused {
		border-color: var(--green);
	}

	input {
		text-align: right;
	}

	.input-wrap {
		flex: 1 1 auto;
	}

	.label {
		display: flex;
		align-items: center;
		color: var(--sonic-silver);
	}

	.error {
		color: var(--orange);
	}

	.dim {
		color: var(--dim-gray);
	}

	.clickable {
		color: var(--green);
		cursor: pointer;
	}

	:global(.row .value svg) {
		fill: var(--green);
		height: 16px;
		margin-bottom: -3px;
	}

</style>


<div class='data-list'>
	{#each data as row}
		{#if row.type == 'input'}
			<div class='row input-row' class:focused={amountIsFocused}>
				<div class='label'>{row.label}</div>
				<div class='value input-wrap'>
					<input id='amount' type=number bind:value={value} min=0 max=10000000 on:keyup={row.onKeyUp} on:focus={() => {amountIsFocused = true}} on:blur={() => {amountIsFocused = false}} placeholder={`0.0 ${BASE_SYMBOL}`}> 
				</div>
			</div>
		{:else}
			{#if row.value !== null}
				<div class='row'>
					<div class='label'>{row.label}{#if row.helper}<Helper marginLeft={true} text={row.helper} direction='right' />{/if}</div>
					<div class:error={!row.isEmpty && row.hasError} class:dim={row.dim} class:clickable={Boolean(row.onclick)} on:click={row.onclick} class='value'>
						{#if row.renderHTML}
							{@html row.value}
						{:else if row.isEmpty}
							-
						{:else if row.addMargin}
							{row.value} (<a on:click={() => {showModal('AddMargin', row.data)}} data-intercept="true">add</a>)
						{:else}
							{row.value}
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	{/each}
</div>