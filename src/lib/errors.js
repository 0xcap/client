
const DEFAULT_ERROR = "Unexpected error. Please try again later.";

const ERROR_STRINGS = {
	'!C': 'Stake exceeds vault cap.'
}

export function parseErrorToString(e) {
	//console.error('sre', e);
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
	return error_string || DEFAULT_ERROR;
}