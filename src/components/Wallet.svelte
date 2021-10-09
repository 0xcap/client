<script>

	import { onMount } from 'svelte'

	import { BASE_SYMBOL } from '../lib/constants'
	import { SPINNER_ICON, CANCEL_ICON } from '../lib/icons'
	import { initMetamaskSession, disconnectWallet } from '../lib/wallet'
	import { formatToDisplay, shortAddr, addrLink } from '../lib/utils'

	import { showModal } from '../stores/modals'
	import { hasPending, checkPendingTransactions } from '../stores/transactions'
	import { selectedAddress, chainId, isUnsupported, networkLabel, userBaseBalance } from '../stores/wallet'

	onMount(async () => {
		await initMetamaskSession();
		await checkPendingTransactions();
	});

</script>

<style>
	
	.wallet {
		display: flex;
		align-items: center;
	}

	.network {
		color: var(--orange);
		display: flex;
	}

	@media (max-width: 600px) {
		.network {
		}
	}

	.balance {
		margin-right: 8px;
	}

	@media (max-width: 600px) {
		.balance {
			display: none;
		}
	}

	.address {
		white-space: nowrap;
	}

	@media (max-width: 600px) {
		.address {
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 75px;
		}
	}

	.clickable-item {
		display: flex;
		align-items: center;
		border-radius: var(--base-radius);
		background-color: var(--jet-dim);
		padding: 0 12px;
		height: 36px;
		border: 1px solid transparent;
		color: inherit;
	}

	.clickable-item a {
		color: inherit;
	}
	.clickable-item a:hover {
		color: var(--green);
	}

	.has-pending {
		color: var(--green);
		margin-right: 8px;
		margin-left: -3px;
	}
	:global(.wallet .has-pending svg) {
		height: 24px;
		margin-bottom: -3px;
	}

	.disconnect {
		margin-left: 8px;
		fill: var(--dim-gray);
		cursor: pointer;
	}
	.disconnect:hover {
		fill: var(--red);
	}

	:global(.wallet .disconnect svg) {
		height: 16px;
		margin-bottom: -2px;
		fill: inherit;
	}

	button {
		background-color: var(--green);
		color: var(--green-dark);
		padding: 8px 16px;
		border-radius: var(--base-radius);
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
	}
	button:hover {
		background-color: var(--green-dim);
	}

</style>

<div class='wallet'>

	{#if $isUnsupported}
		<div class='network'>
			<div>Wrong Network</div>
			<div class='disconnect' on:click={() => {disconnectWallet(true)}}>{@html CANCEL_ICON}</div>
		</div>
	{:else}

		{#if $selectedAddress}
				<div class='balance'>
					{formatToDisplay($userBaseBalance)} {BASE_SYMBOL}
				</div>
				<div class='clickable-item address-wrap'>
					{#if $hasPending}<div class='has-pending'>{@html SPINNER_ICON}</div>{/if}
					<a class='address' href={addrLink($selectedAddress)} target="_blank">{shortAddr($selectedAddress)}</a>
					<div class='disconnect' on:click|stopPropagation={() => {disconnectWallet()}}>{@html CANCEL_ICON}</div>
				</div>
		{:else}
			<button on:click={() => {showModal('Connect')}} data-intercept="true">Connect Wallet</button>
		{/if}

	{/if}

</div>