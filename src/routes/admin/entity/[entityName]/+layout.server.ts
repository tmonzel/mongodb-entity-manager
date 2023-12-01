
import { defaultCaller } from '$lib/router';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const documents = await (await defaultCaller(event)).documents.loadAll(event.params.entityName);

	if(documents) {
		return {
			documents
		};
	}

	throw error(404, 'Entity not found');
}