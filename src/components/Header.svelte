<script>
	import Nav from './Nav.svelte'
	import Wallet from './Wallet.svelte'
</script>

<style>

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding);
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

	@media (max-width: 960px) {
		.nav {
			display: none;
		}
	}

</style>

<header>
	<div class='left'>
		<a class='logo' href='/'><img src='/img/logo.svg' alt='Cap logo' /></a>
		<div class='nav'><Nav/></div>
	</div>
	<Wallet/>
</header>