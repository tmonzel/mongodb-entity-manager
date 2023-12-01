import { MarketModel } from './admin/market.model';
import { PersonModel } from './admin/person.model';
import { ProjectModel } from './admin/project.model';
import { RetailerModel } from './admin/retailer.model';
import type { EntitySchema } from './entity/types';

const Schemata: EntitySchema[] = [
  PersonModel,
  ProjectModel,
  MarketModel,
  RetailerModel,
];

export async function loadSchema(): Promise<EntitySchema[]> {
  return Schemata;
}

export async function loadEntity(name: string): Promise<EntitySchema | undefined> {
  return Schemata.find(m => m.name === name);
}