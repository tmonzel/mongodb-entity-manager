import type { AbstractAttribute } from '../types';

export interface RelationshipAttribute extends AbstractAttribute {
  type: 'relationship:belongs_to_many' | 'relationship:belongs_to' | 'relationship:has_many';
  ref?: string;
}
