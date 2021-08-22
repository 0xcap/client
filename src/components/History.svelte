<script>
	import { onMount } from 'svelte'
	import { signer, address } from '../stores/provider'
	import { history } from '../stores/history'

	import { showModal } from '../stores/modals'

	let hide_history = false;
	if (localStorage.getItem('hide_history')) {
		hide_history = true;
	}

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
		margin-bottom: var(--base-padding);
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

		.title {
			font-weight: 700;
		}

	.item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: var(--base-radius);
		background-color: var(--gray-between);
		overflow: hidden;
		height: 58px;
		padding: 0 var(--base-padding);
		cursor: pointer;
	}

	.pos {
		color: var(--green);
	}
	.neg {
		color: var(--red);
	}

		.left {
			display: flex;
			align-items: center;
		}

			.direction {
				width: 10px;
				height: 64px;
				margin-right: var(--base-padding);
			}
				.direction.long {
					background-color: var(--green);
				}
				.direction.short {
					background-color: var(--red);
				}

			.info {

			}

				.product {
					display: flex;
					align-items: center;
					font-weight: 700;
				}

				.product img {
					width: 20px;
					height: 20px;
					border-radius: 20px;
				}

				.product span {
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


		.right {
			display: flex;
			align-items: center;
		}


</style>

<div class='history'>

	<div class='header'>
		<div class='title'>History</div>
		<a on:click={toggle}>{hide_history ? 'Show' : 'Hide'}</a>
	</div>

	{#if !hide_history}
		{#each $history as event}
			<div class='item' on:click={() => {showModal('EventDetails', event)}}>
				<div class='left'>
					<div class='info'>
						<div class='product'>
							<span>{event.product}</span>
							<span class='leverage'>{event.leverage}x</span>
						</div>
						<div class='close'>
							{event.amount} {event.base} at {event.priceWithFee}
						</div>
					</div>
				</div>
				<div class='right'>
					<div class={`pnl ${event.pnl * 1 > 0 ? 'pos' : 'neg'}`}>
						{event.pnl * 1 > 0 ? '+' : ''}{event.pnl || 0}
					</div>
				</div>
			</div>
		{/each}
	{/if}
</div>