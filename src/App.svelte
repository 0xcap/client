<script>

	import { component, loadRoute } from './stores/router'

	import { onMount } from 'svelte'
	import { initProvider } from './lib/provider'
	import { initEventListeners } from './lib/events'

	import Header from './components/Header.svelte'
	import Toasts from './components/Toasts.svelte'
	import Footer from './components/Footer.svelte'

	import Account from './components/Account.svelte'
	import { activeModal } from './stores/modals'

	import { provider, signer, address, chainId } from './stores/provider'

	onMount(async () => {	
		initProvider();
		loadRoute(location.hash);
	});

	$: initEventListeners($address, $chainId);

</script>

<div class='gr'></div>
<div>
	<Toasts />
	<Header />
	<main>
		{#if $provider}
			{#if $address}
				{#if $activeModal && $activeModal.name == 'Account'}
					<Account />
				{/if}
			{/if}
			<svelte:component this={$component}/>
			<Footer />
		{/if}
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap');

	:global(:root) {
		--black-almost: rgba(23,23,23,0.55);
		--gray-darkest: rgb(30,30,30);
		--gray-between: rgba(40,40,40,0.25);
		--gray-dark: rgb(55,55,55);
		--gray: rgb(80,80,80);
		--gray-light: rgb(114,114,114);
		--blue: rgb(88,201,242);
		--blue-dark: rgb(88,201,220);
		--red: rgb(255,80,0);
		--red-dark: rgb(235,80,0);
		--green: rgb(0,200,5);
		--green-dark: rgb(0,180,5);
		--pink: rgb(225,80,221);
		--orange: rgb(253,167,20);
		--base-padding: 24px;
		--base-radius: 10px;
		--container-width: 580px;
	}
	:global(a) {
		color: var(--blue);
		text-decoration: none;
		cursor: pointer;
	}
	:global(html) {
		background-color: var(--gray-darkest);
		color: #fff;
		font-family: 'Ubuntu Mono';
		font-size: 19px;
		height: 100%;
	}
	:global(body) {
		position: relative;
		height: 100%;
		padding: 0;
		margin: 0;
	}

	:global(input::-webkit-outer-spin-button,input::-webkit-inner-spin-button) {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}
	:global(input[type='number'],input[type='range'],button) {
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
	:global(hr) {
		display: none;
	}

	main {
		width: 100%;
		max-width: var(--container-width);
		padding: 30px var(--base-padding);
		margin: 0 auto;
		box-sizing: border-box;
	}

	.gr {
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
</style>