import type { AbstractAttribute } from '../types';

export interface SelectAttribute extends AbstractAttribute {
  type: 'select';
  multiple?: boolean;
  options: { name: string; value: any; }[];
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}
