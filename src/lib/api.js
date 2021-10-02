import { formatUnits, formatTrades } from './utils'

const graph_url = 'https://api.thegraph.com/subgraphs/name/0xcap/capv1';

export async function getVolume() {
	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
					vault(id: 1) {
						cumulativeVolume
					}
				}
			`
		})
	});
	const json = await response.json();
	return {
		volume: formatUnits(json.data.vault.cumulativeVolume)
	};
}

export async function getPositionIDs(owner) {
	if (!owner) return;
	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
					positions(where: {owner: "${owner}"}) {
						id
					}
				}
			`
		})
	});
	const json = await response.json();
	let ids = json.data.positions.map((x) => {return x.id});
	return ids;
}

export async function getTrades(owner) {
	if (!owner) return;
	const response = await fetch(graph_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
				query {
				  trades(
				    orderBy: timestamp,
				    orderDirection: desc,
				    first:100,
				    where: {owner: "${owner}"}
				  ) {
				    id,
				    txHash,
				    positionId,
				    productId,
				    margin,
				    leverage,
				    amount,
				    entryPrice,
				    closePrice,
				    isLong,
				    pnl,
				    pnlIsNegative,
				    timestamp,
				    blockNumber,
				    wasLiquidated,
				    isFullClose
				  }
				}
			`
		})
	});
	const json = await response.json();
	return formatTrades(json.data.trades);
}