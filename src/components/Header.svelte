<script>
	import Wallet from './Wallet.svelte'
</script>

<style>

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
	}

	img {
		height: 20px;
	}

</style>

<header>
	<a href='/'><img src='/img/logo.svg' alt='Cap logo' /></a>
	<Wallet/>
</header>