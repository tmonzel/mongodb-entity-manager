import { establishConnection } from './server';
import { registerEntity } from './entity/map.server';
import type { Entity } from './entity';

export function initializeAdmin(
  entities: { [collectionName: string]: Entity },
) {
  // Establish connection to MongoDB
  establishConnection();

  for(const [collectionName, entity] of Object.entries(entities)) {
    registerEntity(collectionName, entity);
  }
}
