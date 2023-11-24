
import { defaultCaller } from '$lib/api/router.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const entity = await (await defaultCaller(event)).entities.load(event.params.entityName);

	if(entity) {
		return {
			entity
		};
	}

	throw error(404, 'Entity not found');
}