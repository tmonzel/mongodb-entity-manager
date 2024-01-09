import type { FormControl } from '$admin/form';
import type { ComponentType, SvelteComponent } from 'svelte';
import type { EmbedAttribute } from './embed/types';
import type { FileAttribute } from './file/types';
import type { InputAttribute } from './input/types';
import type { RelationshipAttribute } from './relationship/types';
import type { SelectAttribute } from './select/types';
import type { SwitchAttribute } from './switch/types';
import type { FindResult, Mutation, Query } from '$admin';
import type { Document } from 'mongodb';
import type { Writable } from 'svelte/store';
import type { Readable } from 'svelte/motion';

export interface AbstractAttribute {
  type: string;
  label?: string;
  editable?: boolean;
}

export interface ObjectAttribute extends AbstractAttribute {
  type: 'object' | 'array';
  renderAs?: string;
  attributes: { [name: string]: EntityAttribute };
  form?: string[];
}

export type EntityAttribute = InputAttribute 
  | ObjectAttribute 
  | RelationshipAttribute 
  | SwitchAttribute 
  | SelectAttribute 
  | EmbedAttribute 
  | FileAttribute;

export type EntityAttributeModule<TAttribute extends AbstractAttribute, V = any> = {
  createControl?: (value: any, attr: TAttribute) => FormControl<V>;
  edit: ComponentType<SvelteComponent<{ key: string; control: FormControl<V>, attribute: TAttribute; value: any }>>;
  value?: ComponentType<SvelteComponent<{ key: string; attribute: TAttribute; value: any }>>;
}

export type EntityAttributeResolver<TAttribute extends AbstractAttribute> = {
  normalize?: (doc: Document, attribute: TAttribute, key: string, query: Query, depth: number, normalizer: EntityNormalizer) => Promise<any>;
  denormalize?: (doc: Document, attribute: TAttribute, key: string, mutation: Mutation, normalizer: EntityDenormalizer) => any;
}

export type EntityAttributeMap = { [name: string]: EntityAttribute };

export type AbstractEntity = {
  type: string;
  attributes: EntityAttributeMap;
  includes?: string[];
  columns?: string[];
}

export interface Entity extends AbstractEntity {
  renderAs?: string;
  identifiedBy?: string;
  actions?: string[];
  title?: string;

  description?: string;
  detail?: { attributes?: string[]; };
  labels?: { [key: string]: string };
  form?: string[];
  
  search?: string;
  pageSize?: number;
}

export interface EmbeddedEntity extends AbstractEntity {
  
}

export type EntitySchema = {
  [collectionName: string]: Entity;
}

export interface EntityContext {
  entity: Entity;
  searchTerm: Writable<string | null>;
  result: Readable<FindResult & { page: number }>;
  find(conditions: { term?: string; page?: number }, debounceTime?: number): void;
}

export type EntityNormalizer = (entity: Entity, data: Document, query: Query, depth: number, includes?: string[]) => Document;
export type EntityDenormalizer = (entity: Entity, data: any, mutation: Mutation) => Document;