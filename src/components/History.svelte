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
		shown_events = _all_events.slice(0, current_index * 5);
		current_index++;
	}

	$: updateShownEvents(all_events);

</script>

<style>

	.history {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 0;
	}

	.history a {
		color: var(--dim-gray);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: var(--base-padding);
	}

	.header .title {
		font-weight: 700;
		font-size: 115%;
	}

	.history-list {
		display: grid;
		grid-auto-flow: row;
		grid-gap: 6px;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		overflow: hidden;
		font-size: 115%;
		border-radius: var(--base-radius);
		height: 54px;
		cursor: pointer;
		padding: 0 var(--base-padding);
		background-color: var(--rich-black-fogra);
	}
	.item:hover {
		background-color: var(--eerie-black);
	}

	.item-more {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 var(--base-padding);
		cursor: pointer;
		color: var(--dim-gray);
		border-radius: var(--base-radius);
		height: 50px;
	}
	.item-more:hover {
		color: #fff;
	}

	.direction {
		margin-right: 10px;
		font-weight: 800;
		font-size: 115%;
	}

	.direction.long {
		color: var(--green);
	}

	.direction.short {
		color: var(--red);
	}

	.details {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.info {
		color: var(--sonic-silver);
		font-weight: 400 !important;
		margin-left: 10px;
	}
	@media (max-width: 600px) {
		.info {
			display: none;
		}
	}
	.amount {
		
	}
	.sep {
		opacity: 0.2;
	}
	.price {
		opacity: 0.35;
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
	
			<div class={`item ${event.pnlIsNegative ? 'loss' : 'profit'}`} on:click={() => {showModal('EventDetails', event)}} data-intercept="true">
	
				<div class='details'>
					<div class={`direction ${event.isLong ? 'long' : 'short'}`}>{event.isLong ? '↑' : '↓'}</div>
					<span>{shortSymbol(event.product)}</span>
					<div class='info'>
						<span class='amount'>{formatToDisplay(event.amount, 0, true)}</span> <span class='sep'>|</span> <span class='price'>{formatToDisplay(event.price)}</span>
					</div>
				</div>

				<div class={`pnl ${event.pnlIsNegative ? 'neg' : 'pos'}`}>
					{formatPnl(event.pnl || 0, event.pnlIsNegative)}
				</div>
	
			</div>
	
		{/each}

		{#if shown_events.length < $history.length}
		<div class='item-more' on:click={() => {updateShownEvents()}}>More</div>
		{/if}
	
	</div>
	
	{/if}

</div>
{/if}