import type { Query } from '$admin';
import type { Document } from 'mongodb';
import type { Entity, EntityAttributeMap } from './types';
import { getResolver } from '$admin/server';
import { normalizeRelationshipAttribute } from './relationship/normalizer.server';
import { normalizeEmbedAttribute } from './embed/normalizer.server';

export function extractCoreFields(attributes: EntityAttributeMap) {
  return Object.entries(attributes)
    .filter(([, attr]) => attr.core && attr.core === true)
    .map(([key]) => key);
}

export async function normalizeEntity(entity: Entity, doc: Document, query: Query, fields: string[] = []): Promise<Document> {
  const resultDoc: Document = {};

  for(const [key, attribute] of Object.entries(entity.attributes)) {
    if(fields.indexOf(key) === -1) {
      continue;
    }

    switch(attribute.type) {
      case 'relationship:has_many':
      case 'relationship:belongs_to_many':
      case 'relationship:belongs_to':
        resultDoc[key] = await normalizeRelationshipAttribute(entity, attribute, key, doc, query);
        break;
      case 'embed':
        resultDoc[key] = await normalizeEmbedAttribute(attribute, doc[key], query);
        break;
      default:
        resultDoc[key] = doc[key];
    }
  }
  
  if(doc['_id'] !== undefined) {
    resultDoc['id'] = doc['_id'] + '';
  }

  const resolver = entity ? getResolver(entity.type) : null;

  return resolver && resolver.normalize ? resolver.normalize(resultDoc, query) : resultDoc;
}