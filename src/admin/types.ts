import type { Readable, Writable } from 'svelte/store';
import type { Document, Filter } from 'mongodb';
import type { Entity } from './entity';

export type AdminConfig = {
  // All defined entities
  schema: EntitySchema;

  resolvers?: { [entityName: string]: DocumentResolver<any> };
}

export type EntitySchema = {
  [entityName: string]: Entity;
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
  page?: number;
  filter?: Filter<Document>;
  pageSize?: number;
}

export type DocumentNormalizer<T> = (doc: T, query: Query) => Document;
export type DocumentDenormalizer<T> = (doc: T, mutation: Mutation) => Document;

export type DocumentResolver<T extends Document> = {
  normalize?: DocumentNormalizer<T>;
  denormalize?: DocumentDenormalizer<T>
}

export type Query = {
  type: 'find' | 'findOne' | 'loadEmbed';
  data?: any;
}

export type Mutation = {
  type: 'create' | 'updateOne' | 'embed';
  data?: any;
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