import { defaultCaller } from '$lib/api/router';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const schema = await (await defaultCaller(event)).loadSchema();

	return {
		schema
	};
}
