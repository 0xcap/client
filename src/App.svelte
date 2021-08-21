<script>

	import { component, loadRoute } from './stores/router'

	import { onMount } from 'svelte'
	import { initProvider } from './lib/provider'
	import { initEventListeners } from './lib/events'

	import Header from './components/Header.svelte'
	import Toasts from './components/Toasts.svelte'

	import { provider, signer, address, chainId } from './stores/provider'

	onMount(async () => {	
		initProvider();
		loadRoute(location.pathname);
	});

	$: initEventListeners($address, $chainId);

</script>

<main>
	<Toasts />
	{#if $provider}
		<Header />
		<svelte:component this={$component}/>
	{/if}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Ubuntu+Mono:wght@400;700&display=swap');

	:global(:root) {
		--black-almost: rgb(15,15,15);
		--gray-darkest: rgb(30,30,30);
		--gray-between: rgb(40,40,40);
		--gray-dark: rgb(55,55,55);
		--gray: rgb(80,80,80);
		--gray-light: rgb(144,144,144);
		--blue: rgb(88,201,242);
		--blue-dark: rgb(88,201,220);
		--red: rgb(255,80,0);
		--red-dark: rgb(235,80,0);
		--green: rgb(0,200,5);
		--green-dark: rgb(0,180,5);
		--pink: rgb(225,80,221);
		--base-padding: 16px;
		--base-radius: 5px;
		--container-width: 480px;
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
		font-size: 16.5px;
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
	:global(input[type='number'],button) {
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
		padding: 0 var(--base-padding);
		margin: 24px auto;
	}
</style>