<script>

	import { BASE_SYMBOL } from '../lib/constants'
	import { formatToDisplay, formatPnl } from '../lib/utils'

	import { history } from '../stores/history'
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

	.history-list {
		border-radius: var(--base-radius);
		overflow: hidden;
		display: grid;
		grid-auto-flow: row;
		grid-gap: 4px;
	}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--gray-between);
		overflow: hidden;
		height: 66px;
		font-size: 20px;
		cursor: pointer;
		padding: 0 var(--base-padding);
	}
	.item:hover {
		background-color: var(--gray-dark);
	}

	.info {
	}

	.product {
		display: flex;
		align-items: center;
		font-weight: 700;
	}

	.product .leverage {
		margin-left: 8px;
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
	
		{#each $history as event}
	
			<div class='item' on:click={() => {showModal('EventDetails', event)}} data-intercept="true">
	
				<div class='info'>
					<div class='product'>
						<span>{event.product}</span>
						<span class='leverage'>{formatToDisplay(event.leverage)}x</span>
					</div>
					<div class='close'>
						Closed {formatToDisplay(event.amount)} {BASE_SYMBOL} at {formatToDisplay(event.price)}
					</div>
				</div>

				<div class={`pnl ${event.pnl * 1 > 0 ? 'pos' : 'neg'}`}>
					{formatPnl(event.pnl || 0)}
				</div>
	
			</div>
	
		{/each}
	
	</div>
	
	{/if}

</div>
{/if}