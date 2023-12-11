import type { EntityAttributeMap } from '$admin/types';
import { ObjectId, type Document } from 'mongodb';
import type { Mutations } from './types';
import { getResolver } from '.';

export function denormalizeDocument(entityName: string, attributes: EntityAttributeMap, data: any, mutation: Mutations): Document {
  const result: Document = {};

  for(const [key, attr] of Object.entries(attributes)) {
    switch(attr.type) {
      case 'relationship:has-many':
        result[key] = (data[key] as string[]).map(id => new ObjectId(id))
        break;
      case 'relationship:has-one':
        result[key] = new ObjectId(data[key])
        break;
      case 'number':
        result[key] = parseFloat(data[key]);
        break;
      case 'embed':
        result[key] = (data[key] as Document[]).map(doc => denormalizeDocument(key, attr.entity.attributes, doc, mutation));
        break;
      default:
        result[key] = data[key]
    }
  }

  const resolver = getResolver(entityName);

  return resolver && resolver.denormalize ? resolver.denormalize(result, mutation) : result;
}
