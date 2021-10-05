<script>

	import { onMount } from 'svelte'

	import { CHAIN_DATA, BASE_SYMBOL } from '../lib/constants'
	import { SPINNER_ICON, CARET_DOWN } from '../lib/icons'
	import { initWallet, connectWallet } from '../lib/wallet'
	import { formatToDisplay, shortAddr, addrLink } from '../lib/utils'

	import { toggleMenu, menuVisible, hideMenu } from '../stores/menu'
	import { showModal } from '../stores/modals'
	import { hasPending, checkPendingTransactions } from '../stores/transactions'
	import { selectedAddress, chainId, isUnsupported, networkLabel, userBaseBalance } from '../stores/wallet'

	let scrolled = false;
	onMount(async () => {
		await initWallet();
		await checkPendingTransactions();

		document.body.addEventListener("scroll", () => {
			if (document.body.scrollTop > 44) {
				scrolled = true;
			} else {
				scrolled = false;
			}
		});

	});

</script>

<style>
	
	.wallet {
		display: flex;
		align-items: center;
	}

	.network {
		color: var(--orange);
		margin-right: 16px;
	}

	@media (max-width: 600px) {
		.network {
			margin-right: 8px;
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
		background-color: var(--less-black);
		padding: 0 12px;
		height: 36px;
		border: 1px solid transparent;
		color: inherit;
	}
	.clickable-item:hover {
		background-color: var(--gray);
	}

	.has-pending {
		color: var(--blue);
		margin-right: 6px;
	}
	:global(.wallet .has-pending svg) {
		height: 24px;
		margin-bottom: -3px;
	}

	.has-pending.floating {
		position: fixed;
		top: var(--base-padding);
		right: var(--base-padding);
		z-index: 999;
	}

	button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 8px 16px;
		border-radius: var(--base-radius);
		font-weight: 700;
		cursor: pointer;
		white-space: nowrap;
	}
	button:hover {
		background-color: var(--blue-dark);
	}

</style>

<div class='wallet'>

	{#if $isUnsupported}
		<div class='network'>Unsupported Network</div>
	{/if}

	{#if $selectedAddress}
		{#if !$isUnsupported}
			<div class='balance'>
				{formatToDisplay($userBaseBalance)} {BASE_SYMBOL}
			</div>
			<a class='clickable-item address-wrap' href={addrLink($selectedAddress)} target="_blank">
				{#if $hasPending}<div class:floating={scrolled} class='has-pending'>{@html SPINNER_ICON}</div>{/if}
				<div class='address'>{shortAddr($selectedAddress)}</div>
			</a>
		{/if}
	{:else}
		<button on:click={connectWallet}>Connect Wallet</button>
	{/if}

</div>