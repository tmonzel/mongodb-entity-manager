import type { AbstractAttribute } from '../types';

export interface SwitchAttribute extends AbstractAttribute {
  type: 'switch';
  label: string;
  value?: boolean;
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}
