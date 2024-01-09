import type { Query, Mutation } from '$admin';
import type { Document } from 'mongodb';
import type { EmbedAttribute } from './types';
import type { EntityAttributeResolver, EntityNormalizer, EntityDenormalizer } from '../types';

export const EmbedAttributeResolver: EntityAttributeResolver<EmbedAttribute> = {
  async normalize(doc: any, attr: EmbedAttribute, key: string, query: Query, depth: number, normalizer: EntityNormalizer): Promise<Document[]> {
    const items = doc[key];
    
    if(!Array.isArray(items)) {
      return [];
    }
  
    return Promise.all(
      (items as Document[]).map(
        (doc) => {
          return normalizer(attr.entity, doc, query, depth + 1, attr.entity.includes);
        }
      )
    );
  },

  async denormalize(data: Document, attribute: EmbedAttribute, key: string, mutation: Mutation, denormalizer: EntityDenormalizer) {
    return Promise.all((data[key] as Document[]).map(doc => denormalizer(attribute.entity, doc, mutation)));
  }
}