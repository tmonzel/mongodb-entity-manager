import type { EntitySchema } from '$admin/types';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ params, parent }) {
  const { entity } = await parent();

  if(!entity.nestedSchemata) {
    throw error(404, 'No nested schemata defined');
  }

  const nestedSchema = entity.nestedSchemata.find(s => s.name === params.attrName);

  if(!nestedSchema) {
    throw error(404, 'Nested schema not found');
  }

	return {
		nestedSchema: nestedSchema as EntitySchema
	};
}