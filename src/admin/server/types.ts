import type { Document } from 'mongodb';

export type Queries = 'loadAll' | 'loadOne';
export type Mutations = 'create' | 'updateOne';

export type DocumentNormalizer = (doc: Document, query: Queries) => Document;
export type DocumentDenormalizer = (doc: Document, mutation: Mutations) => Document;

export type DocumentResolver = {
  normalize?: DocumentNormalizer;
  denormalize?: DocumentDenormalizer
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