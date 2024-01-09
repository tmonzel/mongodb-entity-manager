import { FormControl } from '$admin/form';
import RelationshipAttributeControl from './RelationshipAttributeControl.svelte';
import RelationshipValue from './RelationshipValue.svelte';
import type { EntityAttributeModule } from '../types';
import type { RelationshipAttribute } from './types';

export const RelationshipAttributeModule: EntityAttributeModule<RelationshipAttribute> = {
  createControl(value: any, attr: RelationshipAttribute) {
    if(attr.type === 'relationship:belongs_to') {
      return new FormControl<string>(value ? value.id : null);
    }

    return new FormControl<string[]>(Array.isArray(value) ? value.map(obj => obj.id) : []);
  },

  edit: RelationshipAttributeControl,
  value: RelationshipValue
}
