import type { EntitySchema } from '$admin/types';
import { MarketSchema } from '$lib/entities/market.entity';
import { PersonSchema } from '$lib/entities/person.entity';
import { ProjectSchema } from '$lib/entities/project.entity';
import { RetailerSchema } from '$lib/entities/retailer.entity';
import { error } from '@sveltejs/kit';

const Schemata: EntitySchema[] = [
  PersonSchema,
  ProjectSchema,
  MarketSchema,
  RetailerSchema,
];

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const schemata = Schemata;

  if(!schemata) {
    throw error(404, 'Schema not found');
  }

	return {
		schemata
	};
}