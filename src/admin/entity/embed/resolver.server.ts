import type { Query } from '$admin';
import type { Document } from 'mongodb';
import type { EmbedAttribute } from './types';
import type { Entity, EntityAttributeResolver, EntityNormalizer } from '../types';
import { getCoreFieldsFromAttributes } from '../helpers';

async function normalize(doc: any, attr: EmbedAttribute, entity: Entity, key:string, query: Query, normalizer: EntityNormalizer): Promise<Document[]> {
  if(!Array.isArray(doc)) {
    return [];
  }

  return Promise.all(
    (doc as Document[]).map(
      (doc) => {
        return normalizer(attr.entity, doc, query, getCoreFieldsFromAttributes(attr.entity.attributes));
      }
    )
  );
}

export const EmbedAttributeResolver: EntityAttributeResolver<EmbedAttribute> = {
  normalize
}