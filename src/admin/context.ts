import type { EntitySchema } from './types';
import { getContext } from 'svelte';

export function getEntitySchema(): EntitySchema {
  return getContext<EntitySchema>('schema');
}