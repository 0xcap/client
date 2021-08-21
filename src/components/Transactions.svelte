<script>
	import { onMount } from 'svelte'
	import { signer, address, chainId } from '../stores/provider'
	import { transactions, clearTransactions } from '../stores/transactions'
	import { CHAIN_DATA } from '../lib/constants'

	const explorer = CHAIN_DATA[$chainId]['explorer'];

	function txLink(hash) {
		return `${explorer}/tx/${hash}`; 
	}

</script>

<style>
</style>

<div class='container'>
	
</div>