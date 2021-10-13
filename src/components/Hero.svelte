<script>

	import Volume from './Volume.svelte'
	
	import { showHero } from '../stores/modals'

</script>

<style>

	.hero {
		position: fixed;
		z-index: 100000;
		top: 0;
		left: 0;
		overflow-x: hidden;
		right: 0;
		bottom: 0;
		background-color: var(--rich-black-fogra);
		
	}

	.bg {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: url(/img/bg.jpg);
		pointer-events: none;
		opacity: 0.15;
	}

	.container {
		position: relative;
		z-index: 2;
		max-width: 440px;
		margin: 0 auto;
		padding: 60px var(--base-padding);
	}

	header {
		padding-bottom: 20px;
	}

	header img {
		height: 36px;
	}

	h1 {
		padding-bottom: 20px;
		line-height: 1.4;
		font-size: 36px;
	}

	.buttons {
		padding-bottom: 32px;
	}

	button {
		background-color: var(--green);
		color: var(--green-dark);
		padding: 0 var(--base-padding);
		height: 60px;
		border-radius: var(--base-radius);
		font-weight: 700;
		font-size: 120%;
		width: initial !important;
		display: flex;
		align-items: center;
	}
	button:hover {
		background-color: var(--green-dim);
	}

	button svg {
		height: 26px;
		margin-bottom: -2px;
		margin-left: 6px;
	}

	.volume {
		padding-bottom: 60px;
	}

	.volume .label {
		opacity: 0.5;
		margin-bottom: 6px;
		font-size: 80%;
	}

	.volume .value {
		font-weight: 600;
	}

	.features {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 32px;
	}

	.item {
		display: flex;
		align-items: flex-start;
	}

	.item .icon {
		margin-right: 20px;
	}

	.item .icon svg {
		width: 38px;
		color: var(--green);
	}

	.item .body .title {
		font-weight: 700;
		margin-bottom: 6px;
	}

	.item .body .text {
		line-height: 1.4;
	}

</style>

<div class='hero'>

	<div class='bg'></div>

	<div class='container'>

		<header>
			<img src='/img/logo.svg' title='Cap logo' alt='Cap logo' />
		</header>

		<h1>The fastest & cheapest way to leverage trade <br/>on Arbitrum.</h1>

		<div class='buttons'>
			<button on:click={() => {location.hash = 'trade';showHero.set(false);window.scrollTo(0,0)}}>
				<div>Trade</div>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg> 
			</button>
		</div>

		<div class='volume'>
			<div class='label'>Protocol Volume</div>
			<div class='value'><Volume /></div>
		</div>

		<div class='features'>

			<div class='item'>
				<div class='icon'>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
					</svg>
				</div>
				<div class='body'>
					<div class='title'>Community led</div>
					<div class='text'>Cap is a decentralized, community-funded project. Find us on <a href='https://t.me/capfin' target='_blank'>Telegram</a> and <a href='https://twitter.com/CapDotFinance' target='_blank'>Twitter</a>.</div>
				</div>
			</div>

			<div class='item'>
				<div class='icon'>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
					</svg>
				</div>
				<div class='body'>
					<div class='title'>Blazing fast</div>
					<div class='text'>Trades are executed and confirmed in seconds.</div>
				</div>
			</div>

			<div class='item'>
				<div class='icon'>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
					</svg>
				</div>
				<div class='body'>
					<div class='title'>Low cost</div>
					<div class='text'>Cap's contracts are ultra-gas-optimized and there are no trading fees beyond the spread.</div>
				</div>
			</div>

			<div class='item'>
				<div class='icon'>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
					</svg>
				</div>
				<div class='body'>
					<div class='title'>Permissionless</div>
					<div class='text'>Trade directly from your wallet — no account needed.</div>
				</div>
			</div>

		</div>

	</div>

</div>