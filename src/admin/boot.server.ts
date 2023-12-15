import { establishConnection } from './server';
import { registerEntity } from './entity/map.server';
import type { DocumentResolver, EntitySchema } from './types';
import { registerEntityResolver } from './entity/resolver.server';

export function initializeAdmin(
  schema: EntitySchema, 
  resolvers: { [type: string]: DocumentResolver<any> } = {}
) {
  // Establish connection to MongoDB
  establishConnection();

  for(const [name, entity] of Object.entries(schema)) {
    registerEntity(name, entity);
  }

  for(const [type, resolver] of Object.entries(resolvers)) {
    registerEntityResolver(type, resolver);
  }
}
