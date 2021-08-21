<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { initWallet, connectWallet } from '../lib/wallet'

	import { baseInfo } from '../stores/bases'
	import { userBaseBalance } from '../stores/wallet'

	import { shortAddr, formatBaseAmount } from '../lib/utils'

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

	onMount(async () => {	
		initWallet();
	});

</script>

<style>
		
	.address-wrap {
		display: flex;
		align-items: center;
	}

		.balance {
			padding-right: 6px;
		}

		.address {
			display: flex;
			align-items: center;
			background-color: var(--gray-dark);
			padding: 6px 10px;
			border-radius: var(--base-radius);
		}

		.pending {
			color: var(--pink);
		}

	a {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 8px;
		border-radius: var(--base-radius);
	}

</style>

<div class='wallet'>
	{#if $address}
		<div class='address-wrap'>
			<div class='balance'>
				{formatBaseAmount($userBaseBalance)} {$baseInfo.symbol}
			</div>
			<div class='address'>
				<span>{shortAddr($address)}</span>
				{#if true}<div class='pending'>P</div>{/if}
			</div>
		</div>
	{:else}
		<a on:click={connectWallet}>Connect Metamask</a>
	{/if}
</div>