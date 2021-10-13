<script>
	import Wallet from './Wallet.svelte'
	import { showHero } from '../stores/modals'
	
</script>

<style>

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: var(--base-padding);
	}

	.left {
		display: flex;
		align-items: center;
	}

	img {
		height: 20px;
		cursor: pointer;
	}

</style>

<header>
	<div class='left'>
		<img src='/img/logo.svg' title='Cap logo' alt='Cap logo' on:click={() => {location.hash = '';showHero.set(true);}} />
	</div>
	<Wallet/>
</header>