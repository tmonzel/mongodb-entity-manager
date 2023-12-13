import type { Entity } from '$admin/types';
import type { Document } from 'mongodb';
import type { DocumentResolver } from './types';

export function createEntity(schema: Entity) {
  return schema;
}

export function createResolver<T extends Document>(resolver: DocumentResolver<T>): DocumentResolver<T> {
  return resolver;
}
