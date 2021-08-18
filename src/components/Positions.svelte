<script>
	import { positions } from '../stores/positions'
</script>

<style>
</style>

<div class='container'>
	Positions
	<ul>
		{#each $positions as position}
			<li>{position.product} {position.base} {position.id} {position.margin}x{position.leverage} @{position.price} [{position.isSettling}] ({position.isLong})</li>
		{/each}
	</ul>
</div>