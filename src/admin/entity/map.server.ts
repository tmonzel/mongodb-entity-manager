import type { Entity, EntitySchema } from './types';

const entityMap = new Map<string, Entity>();

export function registerEntity(type: string, entity: Entity): void {
  entityMap.set(type, entity);
}

export function entityExists(type: string): boolean {
  return entityMap.has(type);
}

export function getEntity(type: string): Entity | undefined {
  return entityMap.get(type);
}

export function getSchema(): EntitySchema {
  return Object.fromEntries(entityMap);
}
