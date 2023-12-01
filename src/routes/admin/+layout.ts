import { loadSchema } from '$lib/schema.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load() {
  const schemata = await loadSchema();

  if(!schemata) {
    throw error(404, 'Schema not found');
  }

	return {
		schemata
	};
}