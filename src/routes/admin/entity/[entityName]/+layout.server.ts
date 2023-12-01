
import { defaultCaller } from '$lib/router';
import { loadEntity } from '$lib/schema';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const entity = await loadEntity(event.params.entityName);

	if(!entity) {
		throw error(404, 'Entity not found');
	}

	const documents = await (await defaultCaller(event)).documents.loadAll(entity.name);

	if(!documents) {
		throw error(404, 'Loading documents failed');
	}

	return {
		entity,
		documents
	};
}