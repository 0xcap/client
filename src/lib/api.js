import { formatUnits } from './utils'

const graph_url = 'https://api.studio.thegraph.com/query/7324/cap-v1/v0.0.6';

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
	console.log('getPositionIDs', owner);
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
	console.log(ids);
	return ids;
}