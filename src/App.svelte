<script>
	import Home from './pages/Home.svelte';
</script>

<style>
	.test {
		color: red;
	}
	:global(:root) {
		--color-main: red;
		--base-padding: 18px;
		--color-green: #00CF29;
		--color-blue: #0000EE;
		--border-color: #c8c8c8;
		--border-color-light: #ddd;
		--bg-color: #fff;
		--container-width: 660px;
	}
	:global(a) {
		color: var(--color-blue);
		text-decoration: underline;
		cursor: pointer;
	}
</style>

<main>
	<Home/>
</main>