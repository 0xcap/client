<script>

	import { onMount } from 'svelte'
	
	import Toasts from './components/Toasts.svelte'
	import Header from './components/Header.svelte'
	import Footer from './components/Footer.svelte'

	import Trade from './pages/Trade.svelte'

	// Modals
	import Account from './components/Account.svelte'
	import Products from './components/Products.svelte'
	import Leverage from './components/Leverage.svelte'
	import PositionDetails from './components/PositionDetails.svelte'
	import AddMargin from './components/AddMargin.svelte'
	import ClosePosition from './components/ClosePosition.svelte'
	import EventDetails from './components/EventDetails.svelte'

	import { subscribeToProducts } from './lib/stream'
	import { initEventListeners } from './lib/events'
	import { hidePopoversOnClick } from './lib/utils'

	import { contractReady } from './stores/contracts'
	import { activeModal } from './stores/modals'
	import { activeProducts } from './stores/prices'
	import { selectedAddress, chainId, isUnderMaintenance } from './stores/wallet'

	onMount(async () => {
		hidePopoversOnClick();
	});

	$: initEventListeners($selectedAddress, $chainId);
	$: subscribeToProducts(Object.keys($activeProducts));

</script>

<style>

	@font-face {
	  font-family: 'Inter var';
	  font-style: normal;
	  font-weight: 100 900;
	  font-display: swap;
	  src: url('fonts/Inter-roman.var.woff2?v=3.19') format('woff2');
	  font-named-instance: 'Regular';
	}

	:global(:root) {
		--black-almost: rgba(23,23,23,0.55);
		--gray-darkest: rgb(30,30,30);
		--gray-between: rgb(40,40,40);
		--gray-dark: rgb(55,55,55);
		--gray: rgb(80,80,80);
		--gray-light: rgb(125,125,125);
		--blue: rgb(88,201,242);
		--blue-dark: rgb(65,194,241);
		--red: rgb(255,80,0);
		--red-dark: rgb(235,80,0);
		--green: rgb(0,200,5);
		--green-dark: rgb(0,180,5);
		--pink: rgb(225,80,221);
		--orange: rgb(253,167,20);
		--base-padding: 20px;
		--semi-padding: 16px;
		--base-radius: 18px;
		--container-width: 580px;
	}
	@supports (font-variation-settings: normal) {
	  :global(:root) {
	  	font-family: 'Inter var', sans-serif;
	  }
	}

	:global(html) {
		background-color: var(--gray-darkest);
		color: #fff;
		font-family: 'Inter var';
		font-feature-settings: 'ss01','ss02','ss03','cv01','tnum';
		font-size: 16.5px;
		font-variant: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-tap-highlight-color: transparent;
	}

	:global(body) {
		padding: 0;
		margin: 0;
	}
	:global(.overflow-hidden) {
		overflow: hidden;
	}

	:global(a) {
		color: var(--blue);
		text-decoration: none;
		cursor: pointer;
	}
	
	:global(input::-webkit-outer-spin-button,input::-webkit-inner-spin-button) {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}

	:global(input[type='number'],input[type='range'],input[type='text']) {
		appearance: textfield;
		-moz-appearance: textfield;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		color: inherit;
		outline: none;
		border: none;
		background-color: transparent;
		width: 100%;
	}

	:global(button) {
		text-align: center;
		cursor: pointer;
		user-select: none;
		appearance: none;
		-moz-appearance: none;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		outline: none;
		border: none;
		width: 100%;
	}

	:global(.no-scrollbar::-webkit-scrollbar) {
	    width: 0px;
	    background: transparent; /* Chrome/Safari/Webkit */
	}

	:global(.no-scrollbar) {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none;  /* IE 10+ */
	}

	.grid {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 50px;
	}

	.radial-gradient {
		position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    width: 200vw;
	    height: 200vh;
		background: radial-gradient(50% 50% at 50% 50%,rgba(0,180,5,0.02) 0,rgba(255,255,255,0) 100%);
		pointer-events: none;
		transform: translate(-50vw,-100vh);
		z-index: -1;
	}

	main {
		width: 100%;
		max-width: var(--container-width);
		padding: 0 var(--base-padding);
		margin: 0 auto;
		box-sizing: border-box;
	}

	.maintenance {
		padding: 20px;
		text-align: center;
		line-height: 1.55;
	}

</style>

{#if $activeModal && $activeModal.name == 'Account'}
	<Account />
{/if}
{#if $activeModal && $activeModal.name == 'Products'}
	<Products />
{/if}
{#if $activeModal && $activeModal.name == 'Leverage'}
	<Leverage />
{/if}
{#if $activeModal && $activeModal.name == 'PositionDetails'}
	<PositionDetails data={$activeModal.data} />
{/if}
{#if $activeModal && $activeModal.name == 'AddMargin'}
	<AddMargin data={$activeModal.data} />
{/if}
{#if $activeModal && $activeModal.name == 'ClosePosition'}
	<ClosePosition data={$activeModal.data} />
{/if}

<EventDetails isActive={$activeModal && $activeModal.name == 'EventDetails'} data={$activeModal.data} />
<Toasts />
<div class='grid'>
	<div class='radial-gradient'></div>
	<Header />
	{#if $isUnderMaintenance}
		<div class='maintenance'>Cap is under maintenance on this Ethereum network. Try Rinkeby.</div>
	{:else}
		{#if $contractReady}
		<main>
			<Trade />
		</main>
		{/if}
	{/if}
	<Footer />
</div>