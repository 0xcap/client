<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { history } from '../stores/history'

</script>

<style>
</style>

<div class='container'>
	History
	<ul>
	{#each $history as event}
		<li>Event: {event.type} {event.margin} {event.pnl}</li>
	{/each}
	</ul>
</div>