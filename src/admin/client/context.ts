import type { EntitySchema } from '$admin/types';
import { getContext } from 'svelte';

export function getEntitySchema(): EntitySchema {
  return getContext<EntitySchema>('schema');
}