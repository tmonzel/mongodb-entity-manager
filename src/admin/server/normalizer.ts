import type { Document, ObjectId } from 'mongodb';
import { getCollection, getEntity, getResolver } from '.';
import type { Queries } from './types';
import type { EntityAttributeMap } from '$admin/types';

async function loadHasMany(entityName: string, ids: ObjectId[], query: Queries): Promise<Document[]> {
  const entity = getEntity(entityName);
  const collection = getCollection(entityName);
  const documents = await collection.find({ _id: { $in: ids }}).toArray();

  return documents.map(doc => normalizeDocument(entityName, entity.attributes, doc, query));
}

async function loadHasOne(entityName: string, id: ObjectId, query: Queries): Promise<Document> {
  const entity = getEntity(entityName);
  const collection = getCollection(entityName);
  const document = await collection.findOne({ _id: id });

  if(!document) {
    throw new Error('Related document not found');
  }

  return normalizeDocument(entityName, entity.attributes, document, query);
}

export async function normalizeDocument(entityName: string, attributes: EntityAttributeMap, doc: Document, query: Queries): Promise<Document> {
  for(const [key, attribute] of Object.entries(attributes)) {
    switch(attribute.type) {
      case 'relationship:has-many':
        doc[key] = await loadHasMany(attribute.target ?? key, doc[key] as ObjectId[], query);
        break;
      case 'relationship:has-one':
        doc[key] = await loadHasOne(attribute.target ?? key, doc[key] as ObjectId, query);
        break;
      case 'embed':
        if(!Array.isArray(doc[key])) {
          doc[key] = [];
        }
        
        doc[key] = (doc[key] as Document[]).map(doc => normalizeDocument(key, attribute.entity.attributes, doc, query));

        break;
    }
  }

  if(doc['_id'] !== undefined) {
    doc['id'] = doc['_id'] + '';
    delete doc['_id'];
  }

  const resolver = getResolver(entityName);

  return resolver && resolver.normalize ? resolver.normalize(doc, query) : doc;
}
