<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { transactions, clearTransactions } from '../stores/transactions'

</script>

<style>
</style>

<div class='container'>
	Transactions (<a on:click={clearTransactions}>Clear</a>)
	<ul>
		{#each $transactions as tx}
			<li>{tx.description} || {tx.state}</li>
		{/each}
	</ul>
</div>