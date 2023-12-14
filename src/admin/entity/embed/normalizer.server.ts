import type { Query } from '$admin';
import type { Document } from 'mongodb';
import { extractCoreFields, normalizeEntity } from '../normalizer.server';
import type { EmbedAttribute } from './types';

export async function normalizeEmbedAttribute(attr: EmbedAttribute, value: any, query: Query): Promise<Document[]> {
  if(!Array.isArray(value)) {
    return [];
  }

  return await Promise.all(
    (value as Document[]).map(
      (doc) => {
        return normalizeEntity(attr.entity, doc, query, extractCoreFields(attr.entity.attributes));
      }
    )
  );
}
