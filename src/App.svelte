<script>
	import Home from './pages/Home.svelte';
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Ubuntu+Mono:wght@400;700&display=swap');

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
		background-color: rgb(30,30,30);
		color: #fff;
		font-family: 'Ubuntu Mono';
	}

	:global(input::-webkit-outer-spin-button,input::-webkit-inner-spin-button) {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}
	:global(input,button) {
		appearance: textfield;
		font-family: inherit;
	}
	:global(hr) {
		display: none;
	}
	/* colors
	#1c1c1e dark bg
	#3a393d gray drak
	#8e8e93 gray text
	#4cd863 green line
	#34c759 green text
	#2d2c2e gray line
	#63d1ff blue text
	#64d2ff blue bg
	#fe3b2f red line
	#ff3b30 red text
	#3e3f40 gray dim
	*/
</style>

<main>
	<Home/>
</main>