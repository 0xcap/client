<script>

	import { onMount } from 'svelte'

	import { CHAIN_DATA, BASE_SYMBOL } from '../lib/constants'
	import { SPINNER_ICON, MENU_ICON } from '../lib/icons'
	import { initWallet, connectWallet } from '../lib/wallet'
	import { formatToDisplay, shortAddr } from '../lib/utils'

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
		cursor: pointer;
		background-color: var(--black-almost);
		padding: 0 12px;
		height: 36px;
		border: 1px solid transparent;
	}
	.clickable-item:hover, .clickable-item.selected {
		border-color: var(--gray-dark);
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

	.menu-wrap {
		margin-left: 8px;
	}

	.menu {
		position: absolute;
		top: 72px;
		right: var(--base-padding);
		background-color: rgb(23,23,23);
		border-radius: var(--base-radius);
		padding: 6px 0;
		min-width: 160px;
		z-index: 102;
	}

	.menu a {
		display: block;
		padding: 8px 16px;
		color: rgb(180,180,180);
	}
	.menu a:hover {
		color: #fff;
	}

	.menu a.button {
		font-weight: 700;
		color: var(--green);
	}
	.menu a.button:hover {
		background-color: var(--green-dark);
	}

	:global(.wallet .menu-icon svg) {
		height: 18px;
		fill: #fff;
	}

</style>

<div class='wallet'>

	{#if $networkLabel}
		<div class='network'>{$networkLabel}</div>
	{:else if $isUnsupported}
		<div class='network'>Unsupported Network</div>
	{/if}

	{#if $selectedAddress}
		{#if !$isUnsupported}
			<div class='balance'>
				{formatToDisplay($userBaseBalance)} {BASE_SYMBOL}
			</div>
			<div class='clickable-item address-wrap' on:click={() => {showModal('Account')}} data-intercept="true">
				{#if $hasPending}<div class:floating={scrolled} class='has-pending'>{@html SPINNER_ICON}</div>{/if}
				<div class='address'>{shortAddr($selectedAddress)}</div>
			</div>
		{/if}
	{:else}
		<button on:click={connectWallet}>Connect Wallet</button>
	{/if}

	<div class='menu-wrap'>
		<div class:selected={$menuVisible} class='clickable-item menu-icon' on:click={toggleMenu} data-intercept="true">{@html MENU_ICON}</div>
		{#if $menuVisible}
			<div class='menu'>
				<a href='https://t.me/capfin' target="_blank" on:click={hideMenu}>Telegram</a>
				<a href='https://twitter.com/CapDotFinance' target="_blank" on:click={hideMenu}>Twitter</a>
				<a href='https://github.com/0xcap' target="_blank" on:click={hideMenu}>Github</a>
				<a class='button' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x43044f861ec040db59a7e324c40507addb673142' target="_blank" on:click={hideMenu}>Buy CAP</a>	
			</div>
		{/if}
	</div>

</div>