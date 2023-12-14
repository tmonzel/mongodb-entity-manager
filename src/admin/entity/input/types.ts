import type { AbstractAttribute } from '../types';

export interface InputAttribute extends AbstractAttribute {
  type: 'text' | 'number';
  validations?: { [name: string]: string | boolean };
  default?: string | number;
}
