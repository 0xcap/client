<script>

	import Wallet from '../components/Wallet.svelte'
	import { switchChain } from '../lib/wallet'
	import { chainId, setNewChain } from '../stores/provider'

	import { CHAIN_DATA } from '../lib/constants'

	// get available chains
	let chains = Object.values(CHAIN_DATA);

</script>

<style>

	.hidden {
		display: none;
	}
		
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.left {
		display: flex;
		align-items: center;
	}

	img {
		height: 24px;
	}

</style>

<header>
	<div class='left'>
		<img src='/img/logo.svg' />
	</div>

	<div class='right'>
		<Wallet/>
	</div>

	<div class='hidden'>
			Chains:
			{#each chains as chain}
			<a class:selected={$chainId == chain.id} on:click={() => {switchChain(chain.id)}}>{chain.label}</a> | 
			{/each}
		</div>
</header>