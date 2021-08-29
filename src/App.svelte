<script>

	import { onMount } from 'svelte'
	
	import Toasts from './components/Toasts.svelte'
	import Header from './components/Header.svelte'
	import Nav from './components/Nav.svelte'
	import Footer from './components/Footer.svelte'
	import Account from './components/Account.svelte'

	import { initEventListeners } from './lib/events'
	import { catchLinks, hidePopoversOnClick } from './lib/utils'

	import { contractsReady } from './stores/contracts'
	import { activeModal } from './stores/modals'
	import { component, loadRoute, navigateTo } from './stores/router'
	import { selectedAddress, chainId } from './stores/wallet'

	onMount(async () => {
		loadRoute(location.hash);
		catchLinks((path) => navigateTo(path));
		hidePopoversOnClick();
	});

	$: initEventListeners($selectedAddress, $chainId);

</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

	:global(:root) {
		--black-almost: rgba(23,23,23,0.55);
		--gray-darkest: rgb(30,30,30);
		--gray-between: rgba(40,40,40);
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
		--base-padding: 22px;
		--semi-padding: 16px;
		--base-radius: 18px;
		--container-width: 580px;
	}

	:global(html) {
		background-color: var(--gray-darkest);
		color: #fff;
		font-family: 'Ubuntu Mono';
		font-size: 18px;
		height: 100%;
	}

	:global(body) {
		position: relative;
		height: 100%;
		padding: 0;
		margin: 0;
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

	:global(input[type='number'],input[type='range']) {
		appearance: textfield;
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
		grid-gap: 40px;
	}

	.radial-gradient {
		position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    width: 200vw;
	    height: 200vh;
		background: radial-gradient(50% 50% at 50% 50%,rgba(0,180,5,0.04) 0,rgba(255,255,255,0) 100%);
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

	.nav {
		display: none;
	}

	@media (max-width: 960px) {
		.nav {
			display: block;
		}
	}

</style>

{#if $activeModal && $activeModal.name == 'Account'}
	<Account />
{/if}
<Toasts />
<div class='grid'>
	<div class='radial-gradient'></div>
	<Header />
	<div class='nav'><Nav /></div>
	{#if $contractsReady}
	<main>
		<svelte:component this={$component}/>
	</main>
	{/if}
	<Footer />
</div>

