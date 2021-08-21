<script>

	import { onMount } from 'svelte'
	import { signer, address, chainId } from '../stores/provider'
	import { transactions, clearTransactions } from '../stores/transactions'
	import { CHAIN_DATA } from '../lib/constants'

	import { shortAddr } from '../lib/utils'

	const explorer = CHAIN_DATA[$chainId]['explorer'];

	function txLink(hash) {
		return `${explorer}/tx/${hash}`; 
	}

	function addrLink(addr) {
		return `${explorer}/address/${addr}`; 
	}

	import Modal from './Modal.svelte'

</script>

<style>

	.info {
		padding: var(--base-padding);
		border-bottom: 1px solid var(--gray-dark);
	}

		.address {
			font-size: 22px;
			font-weight: 700;
			margin-bottom: 10px;
		}

		.view {}

	.transactions {
		padding: var(--base-padding);
	}

		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.top {
			padding-bottom: 4px;
		}

		.txs {
			overflow-y: scroll;
			max-height: 220px;
		}

		.tx {
			color: var(--gray-light);
			padding-top: 12px;
			font-size: 80%;
		}

</style>

<Modal title='Account'>

	<div class='info'>
		<div class='address'>{shortAddr($address)}</div>
		<div class='view'>
			<a href={addrLink($address)}>View on Etherscan</a>
		</div>
	</div>

	<div class='transactions'>

		<div class='row top'>
			<span>Transactions</span>
			<a on:click={clearTransactions}>(Clear)</a>
		</div>

		<div class='txs'>
			{#each $transactions as tx}
				<div class='row tx'>
					<span>{tx.description}{#if tx.state == 'pending'} P{/if}</span>
					<a href={txLink(tx.hash)}>tx</a>
				</div>
			{/each}
		</div>

	</div>

</Modal>