<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { connectWallet } from '../lib/wallet'

	import { baseInfo } from '../stores/bases'
	import { userBaseBalance, userBaseAllowance } from '../stores/wallet'

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
	<div>
		Base Selected || symbol: {$baseInfo.symbol}, address: {$baseInfo.address}, decimals: {$baseInfo.decimals}
	</div>

	{#if $address}
		{$address} (hasPending: {$hasPending})
		<div>
			Wallet balance: {$userBaseBalance}, Allowance: {$userBaseAllowance}
		</div>
	{:else}
		wallet <a on:click={connectWallet}>Connect Metamask</a>
	{/if}
</div>