
const DEFAULT_ERROR = "Unexpected error. Please try again later.";

const ERROR_STRINGS = {
	'User denied': null,
	'exceeds balance': "You don't have enough funds in your wallet.",
	'exceeds allowance': "Please approve enough allowance to complete this transfer.",
	'gas': "Not enough gas. Try adjusting the gas price or gas limit.",
	'!cap': 'Stake exceeds vault cap.',
	'!redemption': "Can't redeem outside redemption period.",
	'!redeem-amount': "Amount to redeem is higher than stake.",
	'!margin': "Margin is too low.",
	'!leverage': "Leverage is too low.",
	'!locked': "User is locked.",
	'!vault-active': "Vault is paused.",
	'!product-active': "Product is paused.",
	'!max-leverage': "Leverage is too high.",
	'!price': "Price is unavailable.",
	'!settling': "Position price is still settling.",
	'!duration': "Can't close before minimum hold time is up.",
	'!max-open-interest': "Trade exceeds max open interest on the vault.",
	'!low-leverage': "Leverage would be too low. Try adding less margin.",
	'!vault-insufficient': "Not enough funds are in the vault to complete this trade.",
	'!max-drawdown': "Max daily drawdown on the vault is already reached."
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