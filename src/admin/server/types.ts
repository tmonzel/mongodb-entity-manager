import type { Document } from 'mongodb';

export type DocumentNormalizer = (doc: Document, query: Query) => Document;
export type DocumentDenormalizer = (doc: Document, mutation: Mutation) => Document;

export type DocumentResolver = {
  normalize?: DocumentNormalizer;
  denormalize?: DocumentDenormalizer
}

export type Query = {
  type: 'loadAll' | 'loadOne' | 'loadEmbed';
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