<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { connectWallet } from '../lib/wallet'

	import { hasPending, checkPendingTransactions, clearTransactions } from '../stores/transactions'

	async function checkTransactions(_address) {
		if (!_address) return;
		if (!localStorage.getItem('address') || _address.toLowerCase() != localStorage.getItem('address').toLowerCase()) {
			clearTransactions();
		} else {
			await checkPendingTransactions();
		}
	}

	$: checkTransactions($address);

</script>

<style>
	
</style>

<div class='container'>
	{#if $address}
		{$address} (hasPending: {$hasPending})
	{:else}
		wallet <a on:click={connectWallet}>Connect Metamask</a>
	{/if}
</div>