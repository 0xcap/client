<script>

	import { onMount } from 'svelte'

	import { CHAIN_DATA } from '../lib/constants'
	import { SPINNER_ICON, MENU_ICON } from '../lib/icons'
	import { initWallet, connectWallet } from '../lib/wallet'
	import { formatToDisplay, shortAddr } from '../lib/utils'

	import { selectedBase } from '../stores/bases'
	import { toggleMenu, menuVisible } from '../stores/menu'
	import { showModal } from '../stores/modals'
	import { hasPending, checkPendingTransactions } from '../stores/transactions'
	import { selectedAddress, chainId, userBaseBalance } from '../stores/wallet'

	onMount(async () => {
		await initWallet();
		await checkPendingTransactions();
	});

	let network;
	function setNetworkLabel(_chainId) {
		if (!_chainId) return;
		network = CHAIN_DATA[_chainId].label || "Unsupported Network";
	}
	$: setNetworkLabel($chainId);	

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

	.balance {
		margin-right: 8px;
	}

	.clickable-item {
		display: flex;
		align-items: center;
		border-radius: var(--base-radius);
		cursor: pointer;
		background-color: var(--black-almost);
		padding: 8px 12px;
		border: 1px solid transparent;
	}
	.clickable-item:hover, .clickable-item.selected {
		border-color: var(--gray-dark);
	}

	.has-pending {
		color: var(--pink);
		margin-right: 6px;
	}
	:global(.wallet .has-pending svg) {
		height: 26px;
		margin-bottom: -3px;
	}

	button, .button {
		background-color: var(--blue);
		color: var(--gray-darkest);
		padding: 8px 12px;
		border-radius: var(--base-radius);
		font-weight: 700;
		cursor: pointer;
	}
	button:hover, .button:hover {
		background-color: var(--blue-dark);
	}

	.menu-wrap {
		margin-left: 8px;
	}

	.menu {
		position: absolute;
		top: 72px;
		right: var(--base-padding);
		background-color: var(--black-almost);
		border-radius: var(--base-radius);
		padding: 6px 0;
		min-width: 160px;
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
		color: var(--gray-darkest);
		text-align: center;
		margin: 6px 4px 0;
		border-radius: 12px;
	}

	:global(.wallet .menu-icon svg) {
		height: 18px;
		fill: #fff;
	}

</style>

<div class='wallet'>

	{#if network}
		<div class='network'>{network}</div>
	{/if}

	{#if $selectedAddress}
		<div class='balance'>
			{formatToDisplay($userBaseBalance)} {$selectedBase.symbol}
		</div>
		<div class='clickable-item address-wrap' on:click={() => {showModal('Account')}} data-intercept="true">
			{#if $hasPending}<div class='has-pending'>{@html SPINNER_ICON}</div>{/if}
			<div class='address'>{shortAddr($selectedAddress)}</div>
		</div>
	{:else}
		<button on:click={connectWallet}>Connect Wallet</button>
	{/if}

	<div class='menu-wrap'>
		<div class:selected={$menuVisible} class='clickable-item menu-icon' on:click={toggleMenu} data-intercept="true">{@html MENU_ICON}</div>
		{#if $menuVisible}
			<div class='menu'>
				<a href='https://docs.cap.finance' target="_blank">Docs</a>
				<a href='https://github.com/0xcap' target="_blank">Github</a>
				<a href='https://blog.cap.finance' target="_blank">Blog</a>
				<a href='https://t.me/capfin' target="_blank">Telegram</a>
				<a href='https://twitter.com/CapDotFinance' target="_blank">Twitter</a>
				<a class='button' href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x43044f861ec040db59a7e324c40507addb673142' target="_blank">Buy CAP</a>	
			</div>
		{/if}
	</div>

</div>