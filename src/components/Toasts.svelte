<script>
	import { onMount } from 'svelte'
	import { toasts, hideToast } from '../stores/toasts'
</script>

<style>
	.toast {
		background-color: red;
		margin-bottom: 10px;
	}
</style>

<div class='container'>
	{#each $toasts as toast}
		<div class='toast'>[{toast.type}] {toast.message} | <a on:click={() => {hideToast(toast.id)}}>Close</a></div>
	{/each}
</div>