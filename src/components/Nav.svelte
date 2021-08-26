<script>
	import { navigateTo, currentPage } from '../stores/router'

</script>

<style>
	nav {
		margin-left: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	nav .inner {
		background-color: var(--black-almost);
		padding: 4px;
		border-radius: var(--base-radius);
		display: grid;
		grid-auto-flow: column;
		grid-gap: 10px;
	}

	nav a {
		padding: 10px 16px;
		color: var(--gray-light);
	}
	nav a.selected {
		color: #fff;
		font-weight: 700;
		background-color: var(--gray-dark);
		border-radius: 8px;
	}
</style>

<nav>
	<div class="inner">
		<a class:selected={$currentPage == 'trade'} on:click={() => {navigateTo('/trade')}}>Trade</a><a class:selected={$currentPage == 'vault'} on:click={() => {navigateTo('/vault')}}>Vault</a>
	</div>
</nav>