<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { initWallet, connectWallet } from '../lib/wallet'

	import { baseInfo } from '../stores/bases'
	import { userBaseBalance } from '../stores/wallet'

	import { shortAddr, formatBaseAmount } from '../lib/utils'

	import { showModal } from '../stores/modals'
	import { SPINNER_ICON } from '../lib/icons'

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
			border-radius: var(--base-radius);
			cursor: pointer;
		}

		.pending {
			color: var(--pink);
			margin-right: 6px;
		}

		:global(.pending svg) {
			height: 24px;
			margin-bottom: -3px;
		}

	a {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 6px 10px;
		border-radius: var(--base-radius);
		font-weight: 700;
	}

	a:hover {
		background-color: var(--blue-dark);
	}

</style>

<div class='connect'>
	{#if $address}
		<div class='address-wrap'>
			<div class='balance'>
				
			</div>
			<div class='address' on:click={() => {showModal('Account')}}>
				{#if $hasPending}<div class='pending'>{@html SPINNER_ICON}</div>{/if}
				<span>{shortAddr($address)}</span>
			</div>
		</div>
	{:else}
		<a on:click={() => {connectWallet()}}>Connect Wallet</a>
	{/if}
</div>