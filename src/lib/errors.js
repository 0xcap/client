
const DEFAULT_ERROR = "Unexpected error. Please try again later.";

const ERROR_STRINGS = {
	'User denied': null,
	'exceeds balance': "You don't have enough funds in your wallet.",
	'!position': 'Position not found.',
	'!cap': 'Stake exceeds vault cap.',
	'!period': "Can't redeem outside redemption period.",
	'!margin': "Margin is too low.",
	'!leverage': "Leverage is too low.",
	'!locked': "User is locked.",
	'!vault-active': "Vault is paused.",
	'!product-active': "Product is paused.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!position': "This position is no longer available.",
	'!settling': "Position price is still settling. It settles at the next oracle price change.",
	'!owner': "You're not authorized to update this.",
	'!duration': "You can't close before minimum hold time is up.",
	'!exposure-long': "There are too many longs on this product right now. Try again later.",
	'!exposure-short': "There are too many shorts on this product right now. Try again later.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!vault-insufficient': "Not enough funds in the vault to complete this trade. Try again later.",
	'!max-drawdown': "Max daily drawdown on the vault is already reached. Try again later.",
	'gas': "Not enough gas. Try adjusting the gas price or gas limit.",
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