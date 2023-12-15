import type { FormControl } from '$admin/form';
import type { ComponentType, SvelteComponent } from 'svelte';
import type { EmbedAttribute } from './embed/types';
import type { FileAttribute } from './file/types';
import type { InputAttribute } from './input/types';
import type { RelationshipAttribute } from './relationship/types';
import type { SelectAttribute } from './select/types';
import type { SwitchAttribute } from './switch/types';
import type { Mutation, Query } from '$admin';
import type { Document } from 'mongodb';

export interface AbstractAttribute {
  type: string;
  label?: string;
  core?: boolean;
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
  edit: ComponentType<SvelteComponent<{ key: string; control: FormControl<V>, attribute: TAttribute; }>>;
  value?: ComponentType<SvelteComponent<{ key: string; attribute: TAttribute; value: any }>>;
}

export type EntityAttributeResolver<TAttribute extends AbstractAttribute> = {
  normalize?: (doc: Document, attribute: TAttribute, entity: AbstractEntity, key: string, query: Query, normalizer: EntityNormalizer) => Promise<any>;
  denormalize?: (doc: Document, attribute: TAttribute, entity: AbstractEntity, key: string, mutation: Mutation) => any;
}

export type EntityAttributeMap = { [name: string]: EntityAttribute };

export interface AbstractEntity {
  type: string;
  key: string;
  attributes: EntityAttributeMap;
  
  collection: {
    title: string;
    search?: string;
    columns?: string[];
    pageSize?: number;
  };

  labels?: { [key: string]: string };
  form?: string[];
}

export interface Entity extends AbstractEntity {
  description?: string;
  renderAs?: string;
  identifiedBy?: string;
  nestedSchemata?: Entity[];
  detail?: { attributes?: string[]; };
  actions?: string[];
}

export type EntityNormalizer = (entity: Entity, data: Document, query: Query, fields: string[]) => Document;