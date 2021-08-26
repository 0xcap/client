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
	-- update client contract calls to match new definitions
	-- liq price should be calculated on client
	-- fetching vault info has changed
	-- add fee rebate, protocol fee, etc in historical positions
	-- display currently connected network top right


	- write contract tests for everything
	- show percent in U/PL
	- have button in product modal Select BTC/USD 15x
	- fix numbers display, variable decimals for U/PL, etc.
	- loading states: buttons, initial, etc
	- info on modal add margin, stake (how much balance I have), close (position amount), etc.
	- toasts when transactions are submitted / completed. Should be in top right like uniswap, under header
	- bigger everything, more spacing
	- to locale string for numbers
	- position UPL should include fee
	- in modal: price including fee. or find a way to display it with fee
	- closing, add margin errors before submitting if duration not passed, still settling
	- error messages from contract
	- github link, footer links should be top right menu
	- add wallet base balance to account modal
	- tooltips
	- footer: hosted on IPFS
	- keeper shouldn't submit transaction if they already did for the given IDs (pending tx on same set of IDs)
	- more products
	- CAP staking and fee rebates
	- test protocol fee
	-- deploy to rinkeby
	- write trading bot on rinkeby / local that continously trades and stakes, with random amounts, to test
	- refine design, animate, sounds, DRY, icons, ESC to hide modals
	- comment / document code
	- data dashboard, liquidations using graph protocol
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
		padding: var(--base-padding);
	}

	.left {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	nav {
		margin-left: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	nav .inner {
		background-color: var(--black-almost);
		padding: 4px;
		border-radius: var(--base-radius);
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
	}

	nav a {
		padding: 10px 16px;
		color: var(--gray-light);
	}
	nav a.selected {
		color: #fff;
		font-weight: 700;
		background-color: var(--gray-dark);
		border-radius: 8px;
	}

	img {
		height: 20px;
	}

</style>

<div>
	<header>
		<div class='left'>
			<span on:click={() => {navigateTo('/')}}><img src='/img/logo.svg' /></span>
			
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

	<nav>
		<div class="inner">
			<a class:selected={$currentPage == 'trade'} on:click={() => {navigateTo('/trade')}}>Trade</a><a class:selected={$currentPage == 'vault'} on:click={() => {navigateTo('/vault')}}>Vault</a><a class:selected={$currentPage == 'stake'} on:click={() => {navigateTo('/$CAP')}}>$CAP</a>
		</div>
	</nav>
</div>