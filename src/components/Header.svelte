<script>

	import Connect from './Connect.svelte'
	import { switchChain } from '../lib/wallet'
	import { chainId, setNewChain } from '../stores/provider'

	import { navigateTo, currentPage } from '../stores/router'

	import { CHAIN_DATA } from '../lib/constants'

	// get available chains
	let chains = Object.values(CHAIN_DATA);

	/* todo
	-- wallet transactions modal
	-- routing for /trade/product, /vault
	-- positions
	-- add margin modal
	-- close position modal
	-- position details modal
	-- history
	-- vault page
	-- toasts
	-- disconnected / to approve state
	-- footer
	-- icons, favicon
	-- chainlink logo next to price and in modal
	-- contract updates
	- write contract tests for everything
	-- update client contract calls to match new definitions
	-- liq price should be calculated on client
	-- fetching vault info has changed
	-- add fee rebate, protocol fee, etc in historical positions
	-- display currently connected network top right
	- loading states: buttons, initial, etc
	- info on modal add margin, stake (how much balance I have), close (position amount), etc.
	- toasts when transactions are submitted / completed. Should be in top right like uniswap, under header
	- bigger everything, more spacing
	- to locale string for numbers
	- error messages from contract
	- github link
	- footer: hosted on IPFS
	- test CAP staking and fee rebates
	- test protocol fee
	-- deploy to rinkeby

	- refine design, animate, sounds, DRY, icons, ESC to hide modals
	- error messages from contract
	- comment / document code
	- data dashboard, liquidations
	- L2 chainlink sequencer https://docs.chain.link/docs/l2-sequencer-flag/
	
	*/

</script>

<style>

	.hidden {
		display: none;
	}
		
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.left {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	nav {
		padding: 6px 4px;
		border-radius: var(--base-radius);
		margin-left: 12px;
	}

	nav a {
		padding: 0 6px;
		color: var(--gray-light);
	}
	nav a.selected {
		color: #fff;
		font-weight: 700;
	}

	img {
		height: 24px;
	}

</style>

<header>
	<div class='left'>
		<span on:click={() => {navigateTo('/')}}><img src='/img/logo.svg' /></span>
		<nav>
			<a class:selected={$currentPage == 'trade'} on:click={() => {navigateTo('/trade')}}>Trade</a><a class:selected={$currentPage == 'vault'} on:click={() => {navigateTo('/vault')}}>Vault</a>
		</nav>
	</div>

	<div class='right'>
		<Connect/>
	</div>

	<div class='hidden'>
			Chains:
			{#each chains as chain}
			<a class:selected={$chainId == chain.id} on:click={() => {switchChain(chain.id)}}>{chain.label}</a> | 
			{/each}
		</div>
</header>