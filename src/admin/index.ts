import type { Document } from 'mongodb';
import type { Entity } from './entity';
import type { DocumentResolver } from './types';

export * from './types';
export * from './helpers';
export * from './actions';

export function createEntity(schema: Entity) {
  return schema;
}

export function createResolver<T extends Document>(resolver: DocumentResolver<T>): DocumentResolver<T> {
  return resolver;
}
