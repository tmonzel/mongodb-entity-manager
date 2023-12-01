import type { Document } from 'mongodb';

export type DataSchema = {
  [entityName: string]: EntitySchema;
}

export interface RelationshipAttribute {
  type: 'relationship:has-many' | 'relationship:has-one';
  name: string;
  label?: string;
  target?: string;
}

export interface ObjectAttribute {
  type: 'object' | 'array';
  name: string;
  label?: string;
  renderAs?: string;
  attributes: EntityAttribute[];
}

export interface SwitchAttribute {
  type: 'switch';
  name: string;
  label: string;
  value?: boolean;
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface SelectAttribute {
  type: 'select';
  name: string;
  label?: string;
  options: { name: string; value: string | number | null; }[];
  validations?: { [name: string]: string | boolean };
  default?: boolean;
}

export interface InputAttribute {
  type: 'text' | 'number';
  name: string;
  label?: string;
  validations?: { [name: string]: string | boolean };
  default?: string | number;
}

export type EntityAttribute = InputAttribute | ObjectAttribute | RelationshipAttribute | SwitchAttribute | SelectAttribute;

export type EntityCollection = {
  title: string;
  search?: string;
  columns?: string[];
  pageSize?: number;
}

export type EntityDetail = {
  attributes: string[];
}

export type EntitySchema = {
  name: string;
  type: string;
  description?: string;
  renderAs?: string;
  identifiedBy?: string;
  attributes: EntityAttribute[];
  nestedSchemata?: EntitySchema[];
  collection: EntityCollection;
  detail?: EntityDetail;
}

export type CreateDocumentInput = {
  entityName: string;
  data: Document;
}

export type UpdateDocumentInput = {
  entityName: string;

  id: string;
  changes: Partial<Document>;
}