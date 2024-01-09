import type { AbstractAttribute, EmbeddedEntity } from '../types';

export interface EmbedAttribute extends AbstractAttribute {
  type: 'embedded',
  label?: string;
  entity: EmbeddedEntity;
}
