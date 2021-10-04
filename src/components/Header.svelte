<script>
	import Wallet from './Wallet.svelte'
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
	
	.logo {
		margin-right: 16px;
	}

	img {
		height: 20px;
	}

</style>

<header>
	<div class='left'>
		<a class='logo' href='/'><img src='/img/logo.svg' alt='Cap logo' /></a>
	</div>
	<Wallet/>
</header>