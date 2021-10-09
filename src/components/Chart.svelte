<script>

	import { onMount } from 'svelte'
	import { selectedProductId } from '../stores/products'

	const chartProducts = {
		1: "COINBASE:ETHUSD",
		2: "COINBASE:BTCUSD"
	};

	let widget;

	onMount(() => {

		let myScript = document.createElement("script");
		myScript.setAttribute("src", "https://s3.tradingview.com/tv.js");
		document.body.appendChild(myScript);

		myScript.addEventListener("load", scriptLoaded, false);

		function scriptLoaded() {

			widget = new TradingView.widget({
				"autosize": true,
			  "symbol": chartProducts[$selectedProductId],
			  "interval": "15",
			  "timezone": "Etc/UTC",
			  "theme": "dark",
			  "style": "1",
			  "locale": "en",
			  "toolbar_bg": "#212121",
			  "enable_publishing": false,
			  "hide_legend": true,
			  "save_image": false,
			  "container_id": "chart"
			});

		}

	});

	function monitorSelectedProduct(_pid) {
		if (!widget) return;
		const product = encodeURIComponent(chartProducts[_pid]);
		widget.iframe.setAttribute('src', `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_72024&symbol=${product}&interval=15&hidelegend=1&saveimage=0&toolbarbg=212121&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`);
	}

	$: monitorSelectedProduct($selectedProductId)

</script>

<style>

	.chart {
		min-height: 400px;
	}

</style>

<div class='chart' id='chart'>

</div>
