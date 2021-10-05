
const DEFAULT_ERROR = "Unidentified error. Check your browser console for more details.";

const ERROR_STRINGS = {
	'User denied': null,
	'exceeds balance': "Insufficient funds to complete this transaction.",
	'!position': 'Position not found.',
	'!margin': "Margin or amount is too low (min: 0.001 ETH).",
	'!leverage': "Leverage is too low.",
	'!product-active': "Product is paused.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!settling': "Position price is still settling. It settles at the next oracle price change.",
	'!owner': "You're not authorized to update this, or the item is no longer available.",
	'!duration': "You can't close before minimum hold time is up (2min).",
	'!exposure-long': "There are too many longs on this product right now. Try again later.",
	'!exposure-short': "There are too many shorts on this product right now. Try again later.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!vault-insufficient': "Not enough funds in the vault to complete this trade. Try again later.",
	'gas': "Insufficient funds or gas. Deposit more funds into your wallet or try adjusting the gas limit.",
	'nonce': 'Invalid transaction nonce. Try resetting your Metamask account.',
	'InsufficientTxFunds': "You don't have enough funds to complete this transaction."
};

export function parseErrorToString(e) {
	if (!e) return DEFAULT_ERROR;
	if (typeof(e) == 'string') return e;
	let error_string = '';
	if (e.data && e.data.message) {
		error_string = e.data.message;
	} else if (e.message) {
		error_string = e.message;
	} else {
		return DEFAULT_ERROR;
	}
	for (const key in ERROR_STRINGS) {
		if (error_string.includes(key)) return ERROR_STRINGS[key];
	}
	console.error(e);
	return DEFAULT_ERROR;
}