<script>
	
	import { signer, address } from '../stores/provider'
	import { connectWallet } from '../lib/wallet'

</script>

<style>
	
</style>

<div class='container'>
	{#if $address}
		{$address}
	{:else}
		wallet <a on:click={connectWallet}>Connect Metamask</a>
	{/if}
</div>