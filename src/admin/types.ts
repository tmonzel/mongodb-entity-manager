import type { Readable, Writable } from 'svelte/store';
import type { DocumentResolver } from './server/types';
import type { Document, Filter } from 'mongodb';

export type AdminConfig = {
  // All defined entities
  schema: EntitySchema;

  resolvers?: { [entityName: string]: DocumentResolver<any> };
}

export type EntitySchema = {
  [entityName: string]: Entity;
}

export interface AbstractAttribute {
  type: string;
  label?: string;
  core?: boolean;
  virtual?: boolean;
}

export interface RelationshipAttribute extends AbstractAttribute {
  type: 'relationship:belongs_to_many' | 'relationship:belongs_to' | 'relationship:has_many';
  ref?: string;
}

export interface ObjectAttribute extends AbstractAttribute {
  type: 'object' | 'array';
  renderAs?: string;
  attributes: { [name: string]: EntityAttribute };
  form?: string[];
}

export interface EmbedAttribute extends AbstractAttribute {
  type: 'embed',
  entity: AbstractEntity;
}

export interface SwitchAttribute extends AbstractAttribute {
  type: 'switch';
  label: string;
  value?: boolean;
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface SelectAttribute extends AbstractAttribute {
  type: 'select';
  multiple?: boolean;
  options: { name: string; value: any; }[];
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface InputAttribute extends AbstractAttribute {
  type: 'text' | 'number';
  validations?: { [name: string]: string | boolean };
  default?: string | number;
}

export type EntityAttribute = InputAttribute | ObjectAttribute | RelationshipAttribute | SwitchAttribute | SelectAttribute | EmbedAttribute;

export type EntityCollection = {
  title: string;
  search?: string;
  columns?: string[];
  pageSize?: number;
}

export type EntityDetail = {
  attributes?: string[];
}

export type EntityAttributeMap = { [name: string]: EntityAttribute };

export interface AbstractEntity {
  type: string;
  key: string;
  attributes: EntityAttributeMap;
  collection: EntityCollection;
  labels?: { [key: string]: string };
  form?: string[];
}

export interface Entity extends AbstractEntity {
  description?: string;
  renderAs?: string;
  identifiedBy?: string;
  nestedSchemata?: Entity[];
  detail?: EntityDetail;
  actions?: string[];
}

export type FindResult = {
  data: Document[],
  totalItems: number;
  totalPages: number;
}

export interface EntityContext {
  entity: Entity;
  searchTerm: Writable<string | null>;
  result: Readable<FindResult & { page: number }>;
  find(conditions: { term?: string; page?: number }, debounceTime?: number): void;
}

export type FindActionInput = {
  entityName: string;
  page: number;
  filter?: Filter<Document>;
  pageSize?: number;
}