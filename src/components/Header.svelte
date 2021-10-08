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

	img {
		height: 20px;
	}

</style>

<header>
	<div class='left'>
		<img src='/img/logo.svg' title='Cap logo' alt='Cap logo' />
	</div>
	<Wallet/>
</header>