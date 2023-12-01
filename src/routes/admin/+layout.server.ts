import type { EntitySchema } from '$admin/types';
import { MarketModel } from '$lib/models/market.model';
import { PersonModel } from '$lib/models/person.model';
import { ProjectModel } from '$lib/models/project.model';
import { RetailerModel } from '$lib/models/retailer.model';
import { error } from '@sveltejs/kit';

const Schemata: EntitySchema[] = [
  PersonModel,
  ProjectModel,
  MarketModel,
  RetailerModel,
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