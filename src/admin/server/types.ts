import type { Document } from 'mongodb';

export type DocumentNormalizer<T> = (doc: T, query: Query) => Document;
export type DocumentDenormalizer<T> = (doc: T, mutation: Mutation) => Document;

export type DocumentResolver<T extends Document> = {
  normalize?: DocumentNormalizer<T>;
  denormalize?: DocumentDenormalizer<T>
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