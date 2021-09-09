import { formatUnits } from './utils'

export async function getVolume() {
	// cached server-side for 30min
	const response = await fetch('https://keepers-psi.vercel.app/api/volume?chain=arbitrum');
	const json = await response.json();
	return {
		volume: formatUnits(json.volume),
		trades: json.trades
	};
}