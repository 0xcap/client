<script>
	import { VERSION } from '../lib/constants'
	import { CHAINLINK_FULL_ICON } from '../lib/icons'

	import Volume from './Volume.svelte'

</script>

<style>
		
	footer {
		padding: var(--base-padding) 0;
		font-size: 80%;
		color: var(--gray-light);
		text-align: center;
		line-height: 1.55;
	}

	.details {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		padding-top: var(--base-padding);
		color: rgb(70,70,70);
		font-size: 80%;
	}

	:global(.details svg) {
		height: 24px;
		fill: rgb(70,70,70);
		margin-left: 8px;
	}

</style>

<footer>

	<Volume/>

	<div class='details'>Cap v{VERSION} | Hosted on IPFS</div>

	<div class="details">Prices bound by {@html CHAINLINK_FULL_ICON}</div>

</footer>