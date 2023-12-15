import type { Entity } from './types';

const entityMap = new Map<string, Entity>();

export function registerEntity(collectionName: string, entity: Entity): void {
  entityMap.set(collectionName, entity);
}

export function entityExists(collectionName: string): boolean {
  return entityMap.has(collectionName);
}

export function getEntity(collectionName: string): Entity | undefined {
  return entityMap.get(collectionName);
}

export function getSchema(): { [name: string]: Entity } {
  return Object.fromEntries(entityMap);
}
