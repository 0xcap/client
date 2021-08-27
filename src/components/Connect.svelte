<script>
	import { onMount } from 'svelte'
	import { selectedAddress, chainId } from '../stores/wallet'
	import { initWallet, connectWallet } from '../lib/wallet'

	import { CHAIN_DATA } from '../lib/constants'

	import { shortAddr } from '../lib/utils'

	import { showModal } from '../stores/modals'
	import { SPINNER_ICON } from '../lib/icons'

	import { hasPending, checkPendingTransactions, clearTransactions } from '../stores/transactions'

	async function checkTransactions(address) {
		if (!address) return;
		if (!localStorage.getItem('address') || address.toLowerCase() != localStorage.getItem('address').toLowerCase()) {
			clearTransactions();
		} else {
			await checkPendingTransactions();
		}
	}

	let network = '';
	async function checkChain(_chainId) {
		if (!_chainId) return;
		network = CHAIN_DATA[_chainId].label || "Unsupported";
	}

	$: checkTransactions($selectedAddress);
	$: checkChain($chainId);

	onMount(async () => {	
		initWallet();
	});

</script>

<style>
	
	.connect {
		display: flex;
		align-items: center;
	}
	
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

		:global(.connect .pending svg) {
			height: 24px;
			margin-bottom: -2px;
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
	{#if network}{network} {/if}
	{#if $selectedAddress}
		<div class='address-wrap'>
			<div class='balance'>
				
			</div>
			<div class='address' on:click={() => {showModal('Account')}}>
				{#if $hasPending}<div class='pending'>{@html SPINNER_ICON}</div>{/if}
				<span>{shortAddr($selectedAddress)}</span>
			</div>
		</div>
	{:else}
		<a on:click={() => {connectWallet()}}>Connect Wallet</a>
	{/if}
</div>