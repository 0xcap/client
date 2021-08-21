<script>
	import Home from './pages/Home.svelte';
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Ubuntu+Mono:wght@400;700&display=swap');

	:global(:root) {
		--gray-darkest: rgb(30,30,30);
		--gray-dark: rgb(55,55,55);
		--gray: rgb(80,80,80);
		--gray-light: rgb(144,144,144);
		--blue: rgb(88,201,242);
		--red: rgb(255,80,0);
		--red-dark: rgb(235,80,0);
		--green: rgb(0,200,5);
		--green-dark: rgb(0,180,5);
		--pink: rgb(225,80,221);
		--base-padding: 16px;
		--base-radius: 5px;
		--container-width: 480px;
	}
	:global(a) {
		color: var(--blue);
		text-decoration: none;
		cursor: pointer;
	}
	:global(html) {
		background-color: var(--gray-darkest);
		color: #fff;
		font-family: 'Ubuntu Mono';
		font-size: 16.5px;
		height: 100%;
	}
	:global(body) {
		position: relative;
		height: 100%;
		padding: 0;
		margin: 0;
	}

	:global(input::-webkit-outer-spin-button,input::-webkit-inner-spin-button) {
	    display: none;
	    -webkit-appearance: none;
	    margin: 0;
	}
	:global(input,button) {
		appearance: textfield;
		font-family: inherit;
		font-size: inherit;
		font-weight: inherit;
		color: inherit;
		outline: none;
		border: none;
		background-color: transparent;
		width: 100%;
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