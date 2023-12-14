import { FormControl } from '$admin/form';
import type { Document } from 'mongodb';
import RelationshipAttributeControl from './RelationshipAttributeControl.svelte';
import RelationshipValue from './RelationshipValue.svelte';
import type { EntityAttributeModule } from '../types';
import type { RelationshipAttribute } from './types';

export const RelationshipAttributeModule: EntityAttributeModule<RelationshipAttribute> = {
  createControl(value?: Document[]) {
    return new FormControl<string[]>(Array.isArray(value) ? value.map(obj => obj.id) : []);
  },

  edit: RelationshipAttributeControl,
  value: RelationshipValue
}
