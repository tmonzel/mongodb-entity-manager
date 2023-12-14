import { humanize } from '$admin';
import type { AbstractAttribute } from './types';

export function renderAttributeLabel(attr: AbstractAttribute, key: string): string {
  return attr.label ?? humanize(key); 
}