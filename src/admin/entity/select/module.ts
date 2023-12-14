import type { EntityAttributeModule } from '../types';
import SelectAttributeControl from './SelectAttributeControl.svelte';
import SelectAttributeValue from './SelectAttributeValue.svelte';
import type { SelectAttribute } from './types';

export const SelectAttributeModule: EntityAttributeModule<SelectAttribute> = {
  edit: SelectAttributeControl,
  value: SelectAttributeValue
}
