
import { defaultCaller } from '$admin/router';
import type { Entity } from '$admin/types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const parentData = await event.parent();

	const entity = parentData.config.schema[event.params.entityName];

	if(!entity) {
		throw error(404, 'Entity not found');
	}

	const documents = await (await defaultCaller(event)).documents.loadAll(event.params.entityName);

	if(!documents) {
		throw error(404, 'Loading documents failed');
	}

	return {
		entity: entity as Entity,
		documents
	};
}
