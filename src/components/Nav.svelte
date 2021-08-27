<script>
	import { currentPage } from '../stores/router'
</script>

<style>

	nav {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.inner {
		background-color: var(--black-almost);
		padding: 4px;
		border-radius: var(--base-radius);
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
	}

	a {
		padding: 8px 12px;
		color: var(--gray-light);
	}
	a:hover {
		color: #fff;
	}
	
	a.selected {
		color: #fff;
		background-color: var(--gray-dark);
		border-radius: 12px;
	}

</style>

<nav>
	<div class="inner">
		<a class:selected={$currentPage == 'trade'} href='#/trade'>Trade</a><a class:selected={$currentPage == 'vault'} href='#/vault'>Vault</a>
	</div>
</nav>