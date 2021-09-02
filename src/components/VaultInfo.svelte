<script>

	import { BASE_SYMBOL } from '../lib/constants'
	import { LOGOS } from '../lib/logos'
	import { formatToDisplay } from '../lib/utils'

	import { selectedVault, userStaked } from '../stores/vault'
	import { showModal } from '../stores/modals'

</script>

<style>

	.vault {
		background-color: var(--black-almost);
		border-radius: var(--base-radius);
		box-shadow: rgba(88,201,242,0.1) 0px 12px 28px 0;
		padding: var(--base-padding);
		display:  grid;
		grid-auto-flow: row;
		grid-gap: var(--base-padding);
	}

	.title {
		display: flex;
		align-items: center;
		font-size: 22px;
		font-weight: 700;
	}

	.title img {
		width: 32px;
		height: 32px;
		border-radius: 24px;
		margin-right: 10px;
	}

	.description {
		color: var(--gray-light);
		line-height: 1.45;
	}

	.balance-label {
		color: var(--gray-light);
		margin-bottom: 10px;
	}

	.balance-value {
		font-size: 28px;
		font-weight: 700;
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--base-padding) 0;
		border-bottom: 1px solid var(--gray-between);
	}
	.row:last-child {
		border-bottom: none;
	}
	.row.sep {
		border-top: 1px solid var(--gray-dark);
	}

	.label {
		color: var(--gray-light);
	}

	.stake-meter {
		background-color: var(--gray-dark);
		border-radius: var(--base-radius);
		overflow: hidden;
	}

	.stake-progress {
		background-color: #fff;
		height: 6px;
	}

</style>

<div class='vault'>

	<div class='title'>
		<img src={LOGOS[1]} alt={`${BASE_SYMBOL} logo`}>
		<span>Vault ({BASE_SYMBOL})</span>
	</div>

	<div class='description'>This vault backs trader profits while receiving losses, fees, and interest, in {BASE_SYMBOL}.</div>

	<div class='balance'>
		<div class='balance-label'>Balance</div>
		<div class='balance-value'>{formatToDisplay($selectedVault.balance || 0)}</div>
	</div>

	<div class='details'>
		<div class='row'>
			<div class='label'>Total Staked</div>
			<div class='value'>{formatToDisplay($selectedVault.staked) || 0} ({formatToDisplay($selectedVault.staked*100/$selectedVault.cap || 0, 2)}%)</div>
		</div>
		<div class='stake-meter'>
			<div class='stake-progress' style={`width: ${$selectedVault.staked*100/$selectedVault.cap || 0}%`}></div>
		</div>
		<div class='row'>
			<div class='label'>Max Stake Capacity</div>
			<div class='value'>{formatToDisplay($selectedVault.cap)}</div>
		</div>
		<div class='row'>
			<div class='label'>Open Interest</div>
			<div class='value'>{formatToDisplay($selectedVault.openInterest)}</div>
		</div>
		<div class='row'>
			<div class='label'>Max Open Interest</div>
			<div class='value'>{formatToDisplay($selectedVault.maxOpenInterest)}</div>
		</div>
		<div class='row'>
			<div class='label'>Max Daily Drawdown</div>
			<div class='value'>{formatToDisplay($selectedVault.maxDailyDrawdown, 2)}%</div>
		</div>

		<div class='row sep'>
			<div class='label'>My Stake <a on:click={() => {showModal('Stake')}} data-intercept="true">(Stake)</a></div>
			<div class='value'>{formatToDisplay($userStaked)} ({formatToDisplay($userStaked*100/($selectedVault.staked || "N/A"), 4) || 0}%)</div>
		</div>

		<div class='row'>
			<div class='label'>My Balance <a on:click={() => {showModal('Redeem')}} data-intercept="true">(Redeem)</a></div>
			<div class='value'>~{formatToDisplay($selectedVault.balance * $userStaked/$selectedVault.staked || 0)}</div>
		</div>

	</div>

</div>