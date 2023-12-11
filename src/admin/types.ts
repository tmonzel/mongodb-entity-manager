import type { DocumentResolver } from './server/types';

export type AdminConfig = {
  // All defined entities
  schema: EntitySchema;

  resolvers?: { [entityName: string]: DocumentResolver };
}

export type EntitySchema = {
  [entityName: string]: Entity;
}

export interface RelationshipAttribute {
  type: 'relationship:has-many' | 'relationship:has-one';
  label?: string;
  target?: string;
}

export interface ObjectAttribute {
  type: 'object' | 'array';
  label?: string;
  renderAs?: string;
  attributes: { [name: string]: EntityAttribute };
  form?: string[];
}

export interface EmbedAttribute {
  type: 'embed',
  label?: string;
  entity: AbstractEntity;
}

export interface SwitchAttribute {
  type: 'switch';
  label: string;
  value?: boolean;
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface SelectAttribute {
  type: 'select';
  label?: string;
  multiple?: boolean;
  options: { name: string; value: any; }[];
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface InputAttribute {
  type: 'text' | 'number';
  label?: string;
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
  attributes: EntityAttributeMap;
  collection: EntityCollection;
  form?: string[];
}

export interface Entity extends AbstractEntity {
  description?: string;
  renderAs?: string;
  identifiedBy?: string;
  nestedSchemata?: Entity[];
  detail?: EntityDetail;
}