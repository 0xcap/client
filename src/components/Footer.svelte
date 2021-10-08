<script>
	import { onMount, onDestroy } from 'svelte'
	
	import { VERSION } from '../lib/constants'
	import { CHAINLINK_FULL_ICON, IPFS_LOGO } from '../lib/icons'

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
		
	footer {
		padding: var(--base-padding) 0;
		font-size: 80%;
		color: var(--sonic-silver);
		text-align: center;
	}

	.volume {
		padding-bottom: var(--base-padding);
	}

	.volume .label {
		opacity: 0.5;
		padding-bottom: 6px;
	}
	.volume .value {
		font-weight: 500;
	}

	.details {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--base-padding);
	}

	:global(.details svg) {
		height: 28px;
		fill: var(--jet-dim);
		margin: 0 6px;
	}
	:global(.details svg:hover) {
		fill: var(--jet);
	}

	.version {
		text-align: center;
		opacity: 0.25;
	}

</style>

<footer>

	{#if volume}
	<div class='volume'>
		<div class='label'>Protocol Volume</div>
		<div class='value'>{formatToDisplay(volume)} {BASE_SYMBOL} {#if $prices[1]}(${formatToDisplay($prices[1] * volume)}){/if}</div>
	</div>
	{/if}

	<div class='details'>
		<a href='/faq' target='blank'>FAQ</a>
	</div>

	<div class="details">
		<span title='Cap is hosted on IPFS'>{@html IPFS_LOGO}</span> <span title='Trade execution prices are bound by Chainlink'>{@html CHAINLINK_FULL_ICON}</span>
	</div>

	<div class='version'>Cap v{VERSION}</div>

</footer>