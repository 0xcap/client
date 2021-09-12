<script>

	import { BASE_SYMBOL } from '../lib/constants'
	import { formatToDisplay, formatPnl } from '../lib/utils'

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

	function updateShownEvents(all_events) {
		if (!all_events || !all_events.length) return;
		shown_events = all_events.slice(0, current_index * 7);
		current_index++;
	}

	let all_events = [];
	$: all_events = $sessionTrades.concat($history);

	$: updateShownEvents(all_events);

</script>

<style>

	.history {
		display: grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
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
		border-radius: var(--base-radius);
		overflow: hidden;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 5px;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: rgba(40,40,40,0.55);
		overflow: hidden;
		height: 75px;
		font-size: 115%;
		cursor: pointer;
		padding: 0 var(--base-padding);
	}
	.item:hover {
		background-color: rgba(40,40,40,0.85);
	}

	.item-more {
		background-color: rgba(40,40,40,0.55);
		text-align: center;
		padding: var(--base-padding);
		cursor: pointer;
		color: var(--gray-light);
	}
	.item-more:hover {
		color: #fff;
		background-color: rgba(40,40,40,0.85);
	}

	.info {
	}

	.product {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.product .leverage {
		margin-left: 3px;
		font-weight: 400;
	}

	.close {
		color: var(--gray-light);
		margin-top: 6px;
		font-size: 80%;
	}

	.pnl {
		display: flex;
		align-items: center;
	}

	.pos {
		color: var(--green);
	}
	.neg {
		color: var(--red);
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
					<div class='product'>
						<span>{event.product}</span>
						<span class='leverage'>{formatToDisplay(event.leverage)}×</span>
					</div>
					<div class='close'>
						Closed {formatToDisplay(event.amount)} {BASE_SYMBOL} at {formatToDisplay(event.price)}
					</div>
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