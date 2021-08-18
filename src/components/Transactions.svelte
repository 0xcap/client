<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { transactions } from '../stores/transactions'

</script>

<style>
</style>

<div class='container'>
	Transactions
	<ul>
		{#each $transactions as tx}
			<li>{tx.description} || {tx.state}</li>
		{/each}
	</ul>
</div>