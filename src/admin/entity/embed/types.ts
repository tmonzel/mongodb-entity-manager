import type { AbstractAttribute, AbstractEntity } from '../types';

export interface EmbedAttribute extends AbstractAttribute {
  type: 'embed',
  entity: AbstractEntity;
}
