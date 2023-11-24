import type { Validator } from './types';

function required(errorMessage = 'This field cannot be blank'): Validator {
	return (val: unknown) => {
		let valid = true;

		if (val === undefined || val === null) valid = false;

		if (typeof val === 'string') {
			const tmp = val.replace(/\s/g, '');

			valid = tmp.length > 0;
		}

		return { valid, name: 'required', errorMessage };
	};
}

export const Validators = { required };