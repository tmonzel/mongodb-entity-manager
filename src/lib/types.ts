import type { Document } from 'mongodb';

export type DataSchema = {
  [entityName: string]: EntitySchema;
}

export type EntityAttribute = {
  type: 'text' | 'number' | 'object' | 'array';
  name: string;
  label?: string;
  render?: string;
  validations?: { [name: string]: string | boolean };
  children?: EntityAttribute[];
}

export type EntityList = {
  title: string;
  search?: string;
  columns: string[];
  pageSize: number;
}

export type EntitySchema = {
  name: string;
  description?: string;
  attributes: EntityAttribute[];
  list: EntityList;
}

export type Entity = {
  name: string;
  schema: EntitySchema;
  documents: Document[];
}

export type EntityInput = {
  name: string;
  data: Document;
}