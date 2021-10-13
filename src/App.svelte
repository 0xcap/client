<script>

	import { onMount } from 'svelte'
	
	import Hero from './components/Hero.svelte'

	import Toasts from './components/Toasts.svelte'
	import Header from './components/Header.svelte'
	import Footer from './components/Footer.svelte'

	import NewOrder from './components/NewOrder.svelte'
	import Positions from './components/Positions.svelte'
	import History from './components/History.svelte'

	// Modals
	import Connect from './components/Connect.svelte'
	import Products from './components/Products.svelte'
	import Leverage from './components/Leverage.svelte'
	import PositionDetails from './components/PositionDetails.svelte'
	import AddMargin from './components/AddMargin.svelte'
	import ClosePosition from './components/ClosePosition.svelte'
	import EventDetails from './components/EventDetails.svelte'

	import { initWebsocket } from './lib/stream'
	import { initEventListeners } from './lib/events'
	import { hidePopoversOnClick } from './lib/utils'

	import { contractReady } from './stores/contracts'
	import { activeModal, showHero } from './stores/modals'
	import { isUnsupported, selectedAddress, chainId } from './stores/wallet'

	if (location.hash == '#trade') {
		$showHero = false;
	}

	onMount(async () => {
		hidePopoversOnClick();
	});

	initWebsocket();
	$: initEventListeners($selectedAddress, $chainId);

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

		--red: #FF5000;
		--red-dim: #E04700;
		--red-dark: #421500;
		--green: #00C805;
		--green-dim: #00B803;
		--green-dark: #004201;

		--rich-black: #080808;
		--rich-black-fogra: #0F0F0F;
		--eerie-black: #1A1A1A;
		--jet-dim: #212121;
		--jet: #292929;
		--onyx-dim: #353535;
		--onyx: #3D3D3D;
		--dim-gray: #616161;
		--sonic-silver: #707070;
		--orange: rgb(253,167,20);
		
		--base-padding: 20px;
		--semi-padding: 16px;
		--base-radius: 8px;
		--container-width: 580px;

	}

	@supports (font-variation-settings: normal) {
	  :global(:root) {
	  	font-family: 'Inter var', sans-serif;
	  }
	}

	:global(html) {
		background-color: var(--rich-black-fogra);
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

	:global(a) {
		color: var(--green);
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

	:global(input::placeholder) {
		color: var(--dim-gray);
		opacity: 1;
	}
	:global(input::-ms-input-placeholder) {
		color: var(--dim-gray);
	}
	:global(input:-ms-input-placeholder) {
		color: var(--dim-gray);
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

	main {
		width: 100%;
		max-width: var(--container-width);
		padding: 0 var(--base-padding);
		margin: 0 auto;
		box-sizing: border-box;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 60px;
	}

	:global(.pos) {
		color: var(--green) !important;
	}
	:global(.neg) {
		color: var(--red) !important;
	}

</style>

{#if $showHero}
<Hero />
{/if}

{#if $activeModal && $activeModal.name == 'Connect'}
	<Connect />
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
<main>
	<Header />
	{#if $contractReady}
		<NewOrder />
		{#if !$isUnsupported}
			<Positions />
			<History />
		{/if}
		<Footer />
	{/if}
</main>