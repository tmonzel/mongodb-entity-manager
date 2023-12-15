import { getSchema } from '$admin/entity/map.server';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		schema: getSchema()
	};
}
