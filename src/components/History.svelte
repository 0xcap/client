<script>

	import { BASE_SYMBOL } from '../lib/constants'
	import { formatToDisplay, formatPnl, shortSymbol } from '../lib/utils'

	import { history, sessionTrades } from '../stores/history'
	import { showModal } from '../stores/modals'

	let hide_history = false;
	if (localStorage.getItem('hide_history')) hide_history = true;

	function toggle() {
		hide_history = !hide_history;
		if (hide_history) {
			localStorage.setItem('hide_history', true);
		} else {
			localStorage.removeItem('hide_history');
		}
	}

	let shown_events = [];
	let current_index = 1;

	let all_events = [];
	$: all_events = $sessionTrades.concat($history);

	function updateShownEvents(_all_events) {
		if (!_all_events) _all_events = all_events;
		if (!_all_events || !_all_events.length) return;
		shown_events = _all_events.slice(0, current_index * 7);
		current_index++;
	}

	$: updateShownEvents(all_events);

</script>

<style>

	.history {
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
	}

	.history a {
		color: var(--gray-light);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header .title {
		font-weight: 700;
	}

	.history-list {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 12px;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--dim-black);
		overflow: hidden;
		height: 56px;
		font-size: 115%;
		cursor: pointer;
		padding: 0 var(--base-padding);
		border-radius: var(--base-radius);
	}
	.item:hover {
		background-color: var(--gray);
	}

	.item-more {
		background-color: var(--dim-black);
		text-align: center;
		padding: var(--base-padding);
		cursor: pointer;
		color: var(--gray-light);
	}
	.item-more:hover {
		color: #fff;
		background-color: var(--gray);
	}

	.info {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.leverage {
		margin-left: 6px;
		font-weight: 400;
	}

	.price {
		color: var(--gray-light);
		margin-left: 6px;
		font-weight: 400;
	}

	.pnl {
		display: flex;
		align-items: center;
	}

	

</style>

{#if $history.length}
<div class='history'>

	<div class='header'>
		<div class='title'>History</div>
		<a on:click={toggle}>{hide_history ? 'Show' : 'Hide'}</a>
	</div>

	{#if !hide_history}

	<div class='history-list'>
	
		{#each shown_events as event}
	
			<div class='item' on:click={() => {showModal('EventDetails', event)}} data-intercept="true">
	
				<div class='info'>
					<span>{shortSymbol(event.product)}</span>
					<span class='leverage'>{formatToDisplay(event.leverage)}×</span>
					<span class='price'>{formatToDisplay(event.price)}</span>
				</div>

				<div class={`pnl ${event.pnlIsNegative ? 'neg' : 'pos'}`}>
					{formatPnl(event.pnl || 0, event.pnlIsNegative)}
				</div>
	
			</div>
	
		{/each}

		{#if shown_events.length < $history.length}
		<div class='item-more' on:click={() => {updateShownEvents()}}>+More</div>
		{/if}
	
	</div>
	
	{/if}

</div>
{/if}