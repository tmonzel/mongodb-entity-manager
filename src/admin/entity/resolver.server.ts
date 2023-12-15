import type { DocumentResolver, Mutation, Query } from '$admin';
import type { Entity, EntityAttributeMap, EntityAttributeResolver } from './types';
import { RelationshipAttributeResolver } from './relationship/resolver.server';
import { EmbedAttributeResolver } from './embed/resolver.server';
import type { Document } from 'mongodb';

const entityResolverMap = new Map<string, DocumentResolver<any>>();
const attributeResolverMap = new Map<string, EntityAttributeResolver<any>>([
  ['relationship:has_many', RelationshipAttributeResolver],
  ['relationship:belongs_to_many', RelationshipAttributeResolver],
  ['relationship:belongs_to', RelationshipAttributeResolver],
  ['embed', EmbedAttributeResolver]
]);

export function registerEntityResolver(type: string, resolver: DocumentResolver<any>): void {
  entityResolverMap.set(type, resolver);
}

export function createResolver<T extends Document>(resolver: DocumentResolver<T>): DocumentResolver<T> {
  return resolver;
}

export function registerAttributeResolver(type: string, resolver: EntityAttributeResolver<any>): void {
  attributeResolverMap.set(type, resolver);
}

export async function normalizeEntity(entity: Entity, doc: Document, query: Query, fields: string[] = []): Promise<Document> {
  const result: Document = {};

  for(const [key, attribute] of Object.entries(entity.attributes)) {
    if(fields.indexOf(key) === -1) {
      continue;
    }

    const attributeResolver = attributeResolverMap.get(attribute.type);

    if(attributeResolver && attributeResolver.normalize) {
      result[key] = await attributeResolver.normalize(doc, attribute, entity, key, query, normalizeEntity);
    } else {
      result[key] = doc[key]
    }
  }
  
  if(doc['_id'] !== undefined) {
    result['id'] = doc['_id'] + '';
  }

  const resolver = entityResolverMap.get(entity.type);

  if(resolver && resolver.normalize) {
    return resolver.normalize(result, query);
  }

  return result;
}

export async function denormalizeEntity(entity: Entity, attributes: EntityAttributeMap, data: any, mutation: Mutation): Promise<Document> {
  const result: Document = {};

  for(const [key, attr] of Object.entries(attributes)) {

    const attributeResolver = attributeResolverMap.get(attr.type);

    if(attributeResolver && attributeResolver.denormalize) {
      result[key] = await attributeResolver.denormalize(data, attr, entity, key, mutation);
    } else {
      result[key] = data[key]
    }

    /*switch(attr.type) {
      case 'relationship:belongs_to_many':
        result[key] = (data[key] as string[]).map(id => new ObjectId(id))
        break;
      case 'relationship:belongs_to':
        result[key] = new ObjectId(data[key])
        break;
      case 'number':
        result[key] = parseFloat(data[key]);
        break;
      case 'embed':
        result[key] = (data[key] as Document[]).map(doc => denormalizeEntity(key, attr.entity.attributes, doc, mutation));
        break;
      default:
        result[key] = data[key]
    }*/
  }

  const resolver = entityResolverMap.get(entity.type);

  if(resolver && resolver.denormalize) {
    return resolver.denormalize(result, mutation);
  }

  return result;
}