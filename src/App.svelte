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
		--container-width: 480px;
	}
	:global(a) {
		color: var(--color-green);
		text-decoration: underline;
		cursor: pointer;
	}
	:global(html) {
		background-color: #010101;
		color: #fff;
	}

	:global(input::-webkit-outer-spin-button,input::-webkit-inner-spin-button) {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}
	:global(input) {
		appearance: textfield;
	}
</style>

<main>
	<Home/>
</main>