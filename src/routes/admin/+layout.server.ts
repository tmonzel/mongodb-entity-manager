import { getConfig } from '$admin/server';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const config = getConfig();

  if(!config) {
    throw error(404, 'Configuration not found');
  }

	return {
		schema: config.schema
	};
}