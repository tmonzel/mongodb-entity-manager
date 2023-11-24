import type { Document } from 'mongodb';

export type DataSchema = {
  [entityName: string]: EntitySchema;
}

export type EntityAttribute = {
  name: string;
  label: string;
  type: 'text' | 'number';
  required: boolean;
}

export type EntitySchema = {
  name: string;
  attributes: EntityAttribute[]
  description?: string;
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