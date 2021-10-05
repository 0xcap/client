<script>
	import { VERSION } from '../lib/constants'
	import { CHAINLINK_FULL_ICON, IPFS_LOGO } from '../lib/icons'

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
		padding-top: var(--base-padding);
		color: rgb(70,70,70);
	}

	:global(.details svg) {
		height: 32px;
		fill: rgb(70,70,70);
		margin-left: 8px;
	}

</style>

<footer>

	<Volume/>

	<div class="details">
		<span title='Cap is hosted on IPFS'>{@html IPFS_LOGO}</span> <span title='Trade execution prices are bound by Chainlink'>{@html CHAINLINK_FULL_ICON}</span>
	</div>

	<div class='details'>v{VERSION}</div>

</footer>