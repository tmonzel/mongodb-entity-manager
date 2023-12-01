
import { defaultCaller } from '$admin/router';
import type { EntitySchema } from '$admin/types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const parentData = await event.parent();

	const entity = parentData.schemata.find(s => s.name === event.params.entityName);

	if(!entity) {
		throw error(404, 'Entity not found');
	}

	const documents = await (await defaultCaller(event)).documents.loadAll(entity.name);

	if(!documents) {
		throw error(404, 'Loading documents failed');
	}

	return {
		entity: entity as EntitySchema,
		documents
	};
}