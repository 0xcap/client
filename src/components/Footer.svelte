<script>
	
	import { VERSION } from '../lib/constants'
	import { CHAINLINK_FULL_ICON, IPFS_LOGO } from '../lib/icons'

	import Volume from './Volume.svelte'

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
		font-weight: 600;
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
		color: var(--onyx);
		padding-bottom: var(--base-padding);
	}

	.version a {
		color: inherit;
		text-decoration: underline;
	}

</style>

<footer>

	<div class='volume'>
		<div class='label'>Protocol Volume</div>
		<div class='value'><Volume/></div>
	</div>

	<div class="details">
		<span title='Cap is hosted on IPFS'>{@html IPFS_LOGO}</span> <span title='Trade execution prices are bound by Chainlink'>{@html CHAINLINK_FULL_ICON}</span>
	</div>

	<div class='version'>
		Total profits paid are limited by the amount in the&nbsp;<a href='https://arbiscan.io/address/0x1058AFe66BB5b79C295CCCE51016586949Bc4e8d' target='_blank'> treasury</a>.
	</div>

	<div class='version'>Cap v{VERSION} | <a href='/faq' target='blank'>FAQ</a></div>

</footer>