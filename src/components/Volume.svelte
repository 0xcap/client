<script>

	import { onMount, onDestroy } from 'svelte'

	import { getVolume } from '../lib/api'
	import { BASE_SYMBOL } from '../lib/constants'
	import { activateProductPrices } from '../lib/helpers'
	import { formatToDisplay } from '../lib/utils'

	import { prices } from '../stores/prices'

	let volume;

	onMount(async () => {
		activateProductPrices(1); // ETH-USD
		const res = await getVolume();
		volume = res.volume;
		setInterval(async () => {
			const res = await getVolume();
			volume = res.volume;
		}, 20*1000);
	});

	onDestroy(() => {
		clearInterval(v);
	});

</script>

<style>

	.volume {
		color: inherit;
		text-align: center;
	}

</style>

<div class='volume'>
	Volume: {#if volume}
		{formatToDisplay(volume)} {BASE_SYMBOL} {#if $prices[1]}(${formatToDisplay($prices[1] * volume)}){/if}
	{:else}...
	{/if}
</div>