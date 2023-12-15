import { humanize } from '$admin';
import type { AbstractAttribute, Entity, EntityAttributeMap } from './types';

export function createEntity(schema: Entity) {
  return schema;
}

export function getCoreFieldsFromAttributes(attributes: EntityAttributeMap) {
  return Object.entries(attributes)
    .filter(([, attr]) => attr.core && attr.core === true)
    .map(([key]) => key);
}

export function renderAttributeLabel(attr: AbstractAttribute, key: string): string {
  return attr.label ?? humanize(key); 
}