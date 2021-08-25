<script>
	import { TWITTER_ICON, TELEGRAM_ICON } from '../lib/icons'

</script>

<style>
		
	footer {
		padding: var(--base-padding) 0;
		margin-top: 32px;
		font-size: 80%;
		color: var(--gray-light);
		text-align: center;
	}

	div {
		margin-bottom: var(--base-padding);
	}

	:global(footer svg) {
		height: 14px;
		margin-bottom: -3px;
		fill: var(--blue);
	}

</style>

<footer>
	<div>Cap | Decentralized Derivatives Trading</div>
	<div>
		<a href='https://docs.cap.finance'>Docs</a> &#183; <a href='https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x43044f861ec040db59a7e324c40507addb673142'>Buy $CAP</a> &#183; <a href='https://blog.cap.finance'>Blog</a> &#183; <a href='https://t.me/capfin'>{@html TELEGRAM_ICON}</a> &#183; <a href='https://twitter.com/CapDotFinance'>{@html TWITTER_ICON}</a>
	</div>
</footer>