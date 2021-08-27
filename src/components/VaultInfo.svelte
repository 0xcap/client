<script>
	import { selectedVault, userStaked } from '../stores/vault'
	import { selectedBaseId, selectedBase } from '../stores/bases'
	import { showModal } from '../stores/modals'


	import { LOGOS_BASE } from '../lib/constants'
	import { formatToDisplay } from '../lib/utils'

	let amountToStake;
	let amountToUnstake;

	async function _stake() {
		// todo: checks
		await stake(null, amountToStake);
		console.log('submitted stake');
	}

	async function _unstake() {
		// todo: checks
		await unstake(null, amountToUnstake);
		console.log('submitted unstake');
	}

</script>

<style>

	.vault {
		border: 1px solid var(--gray-dark);
		border-radius: var(--base-radius);
		padding: var(--base-padding);
		margin: var(--base-padding) 0;
	}

	.title {
		display: flex;
		align-items: center;
		font-size: 22px;
		font-weight: 700;
		margin-bottom: var(--base-padding);
	}

		.title img {
			width: 32px;
			height: 32px;
			border-radius: 24px;
			margin-right: 10px;
		}

	.description {
		color: var(--gray-light);
		margin-bottom: var(--base-padding);
		line-height: 1.45;
	}

	.balance {
		margin-bottom: var(--base-padding);
	}

	.balance .heading {
		color: var(--gray-light);
		margin-bottom: 10px;
	}

	.balance .balance-value {
		font-size: 28px;
		font-weight: 700;
	}

	.stake-info {
		margin-bottom: var(--base-padding);
	}

	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
	}

	.label {
		color: var(--gray-light);
	}

	.stake-meter {
		background-color: var(--gray-dark);
	}

	.stake-progress {
		background-color: #fff;
		height: 4px;
	}

	.my-stake-info {
		border-top: 1px solid var(--gray-dark);
		padding-top: var(--base-padding);
	}

</style>

<div class='vault'>

	<div class='title'>
		<img src={LOGOS_BASE[$selectedBaseId]} alt={`${$selectedBase.symbol} logo`}>
		<span>Vault ({$selectedBase.symbol})</span>
	</div>

	<div class='description'>This vault backs trader profits while receiving their losses, funding, and fees, in {$selectedBase.symbol}.</div>

	<div class='balance'>
		<div class='heading'>Balance</div>
		<div class='balance-value'>{$selectedVault.balance || 0}</div>
	</div>

	<div class='stake-info'>
		<div class='row'>
			<div class='label'>Total Staked</div>
			<div class='value'>{$selectedVault.totalStaked || 0} ({$selectedVault.totalStaked*100/$selectedVault.cap || 0}%)</div>
		</div>
		<div class='stake-meter'>
			<div class='stake-progress' style={`width: ${$selectedVault.totalStaked*100/$selectedVault.cap || 0}%`}></div>
		</div>
		<div class='row'>
			<div class='label'>Max Stake Capacity</div>
			<div class='value'>{$selectedVault.cap}</div>
		</div>
		<div class='row'>
			<div class='label'>Open Interest</div>
			<div class='value'>{$selectedVault.openInterest}</div>
		</div>
		<div class='row'>
			<div class='label'>Max Open Interest</div>
			<div class='value'>{$selectedVault.maxOpenInterest}</div>
		</div>
		<div class='row'>
			<div class='label'>Max Daily Drawdown</div>
			<div class='value'>{$selectedVault.maxDailyDrawdown}%</div>
		</div>
	</div>

	<div class='my-stake-info'>

		<div class='row'>
			<div class='label'>My Stake <a on:click={() => {showModal('Stake')}}>(stake)</a></div>
			<div class='value'>{$userStaked} ({$userStaked*100/$selectedVault.totalStaked || 0}%)</div>
		</div>

		<div class='row'>
			<div class='label'>My Balance <a on:click={() => {showModal('Redeem')}}>(redeem)</a></div>
			<div class='value'>{formatToDisplay($selectedVault.balance * $userStaked/$selectedVault.totalStaked || 0)}</div>
		</div>

	</div>

</div>