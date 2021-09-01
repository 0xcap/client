<script>

	import Modal from './Modal.svelte'
	
	import { SPINNER_ICON, EXTERNAL_ICON } from '../lib/icons'
	import { shortAddr, txLink, addrLink } from '../lib/utils'

	import { selectedAddress, chainId } from '../stores/wallet'
	import { transactions, clearTransactions } from '../stores/transactions'

</script>

<style>

	.info {
		padding: var(--base-padding);
		border-bottom: 1px solid var(--gray-between);
	}

	.address {
		font-size: 22px;
		font-weight: 700;
		margin-bottom: 10px;
	}

	.empty {
		color: var(--gray-light);
		text-align: center;
	}

	.transactions {
		padding: var(--base-padding);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--base-padding);
	}

	.transactions-list {
		overflow-y: scroll;
		max-height: 220px;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 12px;
		padding: 4px 0;
	}

	.row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--gray-light);
		padding: 2px 0;
	}

	:global(.transactions-list .description svg) {
		height: 16px;
		margin-left: 6px;
		margin-bottom: -4px;
	}

	:global(.transactions-list .link svg) {
		fill: var(--blue);
		height: 12px;
	}

</style>

<Modal title='Account'>

	<div class='info'>
		<div class='address'>{shortAddr($selectedAddress)}</div>
		<div class='view'>
			<a href={addrLink($selectedAddress)} target='_blank'>View on Etherscan</a>
		</div>
	</div>

	<div class='transactions'>

		{#if !$transactions.length}
			<div class='empty'>Your transactions will appear here.</div>
		{:else}

			<div class='header'>
				<span>Transactions</span>
				<a on:click={clearTransactions}>(Clear)</a>
			</div>

			<div class='transactions-list no-scrollbar'>
				{#each $transactions as tx}
					<div class='row'>
						<span class='description'>{tx.description}{#if tx.state == 'pending'}{@html SPINNER_ICON}{/if}</span>
						<a class='link' href={txLink(tx.hash)} target='_blank'>{@html EXTERNAL_ICON}</a>
					</div>
				{/each}
			</div>

		{/if}

	</div>

</Modal>