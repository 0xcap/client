<script>
	import { onMount, onDestroy } from 'svelte'

	import { getVolume } from '../lib/api'
	import { BASE_SYMBOL } from '../lib/constants'
	import { formatToDisplay } from '../lib/utils'

	import { prices } from '../stores/prices'

	let volume;
	let v;
	
	onMount(async () => {
		const res = await getVolume();
		volume = res.volume;
		v = setInterval(async () => {
			const res = await getVolume();
			volume = res.volume;
		}, 20*1000);
	});

	onDestroy(() => {
		clearInterval(v);
	});

</script>

<style>

</style>

{#if volume}
	{formatToDisplay(volume)} {BASE_SYMBOL} {#if $prices[1]}(${formatToDisplay($prices[1] * volume)}){/if}
{/if}