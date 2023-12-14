import type { EntityAttributeModule } from '../types';
import EmbedAttributeControl from './EmbedAttributeControl.svelte';
import EmbedAttributeValue from './EmbedAttributeValue.svelte';
import type { EmbedAttribute } from './types';

export const EmbedAttributeModule: EntityAttributeModule<EmbedAttribute> = {
  edit: EmbedAttributeControl,
  value: EmbedAttributeValue
}