
import type { Entity } from '$admin/types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
	const parentData = await event.parent();
	const entity = parentData.schema[event.params.entityName];

	if(!entity) {
		throw error(404, 'Entity not found');
	}

	return {
		entity: entity as Entity,
	};
}
