import type { Document, Filter } from 'mongodb';

export type FindResult = {
  data: Document[],
  totalItems: number;
  totalPages: number;
}

export type FindActionInput = {
  entityKey: string;
  page?: number;
  filter?: Filter<Document>;
  pageSize?: number;
}

export type DocumentNormalizer<T> = (doc: T, query: Query) => Document;
export type DocumentDenormalizer<T> = (doc: T, mutation: Mutation) => Document;

export type DocumentResolver<T extends object> = {
  output?: DocumentNormalizer<T>;
  input?: DocumentDenormalizer<T>
}

export type Query = {
  type: 'find' | 'findOne' | 'loadEmbed';
  data?: any;
  includes?: string[];
}

export type Mutation = {
  type: 'create' | 'updateOne' | 'embed';
  data?: any;
}

export type CreateDocumentInput = {
  entityKey: string;
  data: Document;
}

export type UpdateDocumentInput = {
  entityKey: string;

  id: string;
  changes: Partial<Document>;
}